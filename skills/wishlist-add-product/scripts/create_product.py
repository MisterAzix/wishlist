#!/usr/bin/env python3
"""Create one wishlist Markdown file from confirmed JSON; no network or Git calls."""
from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import os
import re
import sys
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit


class ProductError(ValueError):
    pass


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ProductError(message)


def text(value: object, field: str) -> str:
    require(isinstance(value, str) and bool(value.strip()), f"{field}: texte non vide requis")
    require(not any(ord(char) < 32 for char in value), f"{field}: caractères de contrôle interdits")
    return value.strip()


def http_url(value: object, field: str) -> str:
    value = text(value, field)
    parsed = urlsplit(value)
    require(parsed.scheme in ("http", "https") and bool(parsed.hostname) and not any(char.isspace() for char in value), f"{field}: URL HTTP(S) requise")
    require(parsed.username is None and parsed.password is None, f"{field}: identifiants dans l'URL interdits")
    try:
        parsed.port
    except ValueError as error:
        raise ProductError(f"{field}: port invalide") from error
    return value


def normalized_url(value: str) -> str:
    parsed = urlsplit(http_url(value, "url"))
    # Remove known tracking keys only. Preserve all variant parameters and fragments.
    tracking = {"fbclid", "gclid", "msclkid", "dclid"}
    pairs = [(key, val) for key, val in parse_qsl(parsed.query, keep_blank_values=True)
             if not key.lower().startswith("utm_") and key.lower() not in tracking]
    port = parsed.port
    authority = parsed.hostname.lower()
    if port and (parsed.scheme, port) not in (("http", 80), ("https", 443)):
        authority += f":{port}"
    return urlunsplit((parsed.scheme.lower(), authority, parsed.path or "/", urlencode(sorted(pairs)), parsed.fragment))


def locate_repo(explicit: str | None) -> Path:
    candidates = [Path(explicit).expanduser().resolve()] if explicit else [Path.cwd(), *Path.cwd().parents]
    for path in candidates:
        if (path / "src/content.config.ts").is_file() and (path / "docs/product-template.md").is_file():
            return path.resolve()
    raise ProductError("Dépôt introuvable : lancer depuis la wishlist ou fournir --repo CHEMIN.")


def scalar(raw: str, source: Path) -> object:
    raw = raw.strip()
    if raw.startswith('"'):
        try:
            return json.loads(raw)
        except json.JSONDecodeError as error:
            raise ProductError(f"{source}: scalaire YAML complexe ; vérifier le doublon manuellement.") from error
    if raw.startswith("'") and raw.endswith("'"):
        return raw[1:-1].replace("''", "'")
    require(raw not in ("|", "|-", "|+", ">", ">-", ">+") and bool(raw),
            f"{source}: scalaire YAML complexe ; vérifier le doublon manuellement.")
    return {"true": True, "false": False, "null": None}.get(raw, raw.split(" #", 1)[0])


def read_existing(path: Path) -> tuple[dict, str]:
    lines = path.read_text(encoding="utf-8-sig").splitlines()
    require(lines and lines[0] == "---", f"{path}: frontmatter absent")
    try:
        end = lines.index("---", 1)
    except ValueError as error:
        raise ProductError(f"{path}: frontmatter non terminé") from error
    fields = {}
    for line in lines[1:end]:
        match = re.match(r"^(title|url|archived):\s*(.*)$", line)
        if match:
            require(match[1] not in fields, f"{path}: champ {match[1]} répété")
            fields[match[1]] = scalar(match[2], path)
    http_url(fields.get("url"), f"{path}: url")
    return fields, "\n".join(lines[end + 1:])


def variant_from_body(body: str) -> dict | None:
    match = re.search(r"^Variante\s*:\s*(\{.*\})\s*$", body, re.M)
    if not match:
        return None
    try:
        value = json.loads(match[1])
        return value if isinstance(value, dict) and value and all(isinstance(key, str) and isinstance(val, str) and key.strip() and val.strip() for key, val in value.items()) else None
    except json.JSONDecodeError:
        return None


def canonical_variant(variant: dict) -> dict:
    return {key.strip().casefold(): " ".join(value.split()).casefold() for key, value in variant.items()}


def create_product(data: dict, repo: Path, write: bool = False) -> dict:
    repo = repo.resolve()
    allowed = {"id", "title", "url", "image", "imageSource", "price", "currency", "category",
               "archived", "priceCheckedAt", "priceBasis", "priceEvidence", "priceSource",
               "missingPriceReason", "reference", "variant", "notes"}
    require(isinstance(data, dict), "L'entrée doit être un objet JSON.")
    require(not set(data) - allowed, "Champs inconnus : " + ", ".join(sorted(set(data) - allowed)))
    slug = text(data.get("id"), "id")
    require(bool(re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug)), "id: slug minuscules/chiffres/tirets requis")
    fields = {"title": text(data.get("title"), "title"), "url": http_url(data.get("url"), "url")}
    schema = (repo / "src/content.config.ts").read_text(encoding="utf-8")
    enum = re.search(r"category:\s*z\.enum\(\s*\[([\s\S]*?)\]", schema)
    require(enum is not None, "Enum des catégories introuvable dans le schéma : vérifier le modèle actuel.")
    categories = re.findall(r'''["']([^"']+)["']''', enum[1])
    category = text(data.get("category"), "category")
    require(category in categories, "category: choisir parmi " + ", ".join(categories))
    currency = text(data.get("currency"), "currency")
    require(bool(re.fullmatch(r"[A-Z]{3}", currency)), "currency: code monétaire de trois lettres majuscules requis")
    image = data.get("image")
    image_source = http_url(data["imageSource"], "imageSource") if data.get("imageSource") is not None else None
    if image is not None:
        image = text(image, "image")
        require(image.startswith("/images/"), "image: chemin local /images/... requis")
        target = (repo / "public" / image.lstrip("/")).resolve()
        require(target.is_relative_to((repo / "public/images").resolve()) and target.is_file(),
                "image: fichier local absent ou chemin hors public/images")
        require(image_source is not None, "imageSource: origine de la photo requise")
    price = data.get("price")
    notes = []
    if price is not None:
        require(not isinstance(price, bool) and isinstance(price, (int, float)) and math.isfinite(price) and price >= 0,
                "price: nombre fini positif ou nul, ou null")
        require(data.get("priceBasis") == "regular", "priceBasis: regular requis pour un prix initial confirmé")
        evidence = text(data.get("priceEvidence"), "priceEvidence")
        source = http_url(data.get("priceSource", fields["url"]), "priceSource")
        date = text(data.get("priceCheckedAt"), "priceCheckedAt")
        try:
            require(dt.date.fromisoformat(date).isoformat() == date, "priceCheckedAt: format YYYY-MM-DD requis")
        except ValueError as error:
            raise ProductError("priceCheckedAt: date ISO YYYY-MM-DD valide requise") from error
        notes += [f"Source du prix initial : {source}", f"Preuve du prix initial : {evidence}"]
    else:
        require(data.get("priceBasis", "unknown") == "unknown", "priceBasis: unknown requis si price est null")
        notes += ["Prix initial non confirmé : " + text(data.get("missingPriceReason"), "missingPriceReason")]
    require(data.get("archived", False) is False, "Nouvelle fiche : archived doit être false ; gérer un achat confirmé séparément.")
    reference = text(data["reference"], "reference") if data.get("reference") is not None else None
    variant = data.get("variant")
    if variant is not None:
        require(isinstance(variant, dict) and bool(variant), "variant: objet non vide de valeurs confirmées requis")
        variant = {text(key, "variant key"): text(val, "variant value") for key, val in variant.items()}
    content = (repo / "src/content/products").resolve()
    require(content.is_relative_to(repo), "Dossier de contenu hors du dépôt")
    output = content / f"{slug}.md"
    require(not output.exists(), f"Fiche existante, aucun écrasement : {output}")
    warnings = []
    for existing in sorted(content.rglob("*.md")):
        old, body = read_existing(existing)
        require(normalized_url(old["url"]) != normalized_url(fields["url"]),
                f"Lien déjà enregistré : {existing.name} (archived={old.get('archived', False)})")
        if reference:
            haystack = " ".join((str(old.get("title", "")), old["url"], body)).casefold()
            pattern = r"(?<![a-z0-9])" + re.escape(reference.casefold()) + r"(?![a-z0-9])"
            if re.search(pattern, haystack):
                old_variant = variant_from_body(body)
                require(variant is not None and old_variant is not None and
                        canonical_variant(variant).keys() == canonical_variant(old_variant).keys() and
                        canonical_variant(variant) != canonical_variant(old_variant),
                        f"Référence déjà présente ou variante ambiguë : {existing.name}. Confirmer les variantes avant de créer une autre fiche.")
                warnings.append(f"Même référence, variantes explicitement distinctes : {existing.name}")
        if old.get("title", "").casefold() == fields["title"].casefold():
            warnings.append(f"Titre déjà présent : {existing.name} ; vérifier produit et variante.")
    fields.update(image=image, price=price, currency=currency, category=category, archived=False)
    if image_source is not None:
        fields["imageSource"] = image_source
    if price is not None:
        fields["priceCheckedAt"] = data["priceCheckedAt"]
    if reference:
        notes.insert(0, "Référence : " + reference)
    if variant:
        notes.insert(1 if reference else 0, "Variante : " + json.dumps(variant, ensure_ascii=False, sort_keys=True))
    if data.get("notes"):
        require(isinstance(data["notes"], str), "notes: texte attendu")
        notes.append(data["notes"].strip())
    markdown = "---\n" + "\n".join(key + ": " + json.dumps(val, ensure_ascii=False, allow_nan=False)
                                     for key, val in fields.items()) + "\n---\n\n" + "\n\n".join(notes) + "\n"
    if write:
        content.mkdir(parents=True, exist_ok=True)
        with output.open("x", encoding="utf-8", newline="\n") as handle:
            handle.write(markdown)
    return {"path": str(output), "written": write, "warnings": warnings, "markdown": markdown}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, help="JSON file, or - for stdin")
    parser.add_argument("--repo", help="Wishlist repository; otherwise locate from cwd")
    parser.add_argument("--write", action="store_true", help="Create the file; default is preview only")
    args = parser.parse_args()
    try:
        raw = sys.stdin.read() if args.input == "-" else Path(args.input).read_text(encoding="utf-8")
        data = json.loads(raw, parse_constant=lambda value: (_ for _ in ()).throw(ProductError(f"Nombre JSON invalide : {value}")))
        result = create_product(data, locate_repo(args.repo), args.write)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except (ProductError, OSError, json.JSONDecodeError) as error:
        print(f"Erreur : {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
