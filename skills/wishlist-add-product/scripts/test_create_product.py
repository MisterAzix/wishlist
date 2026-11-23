#!/usr/bin/env python3
"""Run isolated behavioral tests; never touches the actual product collection."""
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HELPER = Path(__file__).with_name("create_product.py")
spec = importlib.util.spec_from_file_location("create_product", HELPER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


class ProductCreationTests(unittest.TestCase):
    def setUp(self):
        self.sandbox = tempfile.TemporaryDirectory(prefix="wishlist-skill-", dir="/tmp")
        self.repo = Path(self.sandbox.name)
        (self.repo / "src/content/products").mkdir(parents=True)
        (self.repo / "docs").mkdir()
        (self.repo / "docs/product-template.md").write_text("---\ntitle: Example\n---\n")
        (self.repo / "src/content.config.ts").write_text('category: z.enum(["Vêtements", "Autres"])')
        self.data = {
            "id": "test-product", "title": "Test product", "url": "https://example.com/p?color=31&size=M",
            "image": None, "price": None, "currency": "USD", "category": "Vêtements",
            "priceBasis": "unknown", "missingPriceReason": "No regular price found.",
            "reference": "SKU-123", "variant": {"color": "31", "size": "M"},
        }

    def tearDown(self):
        self.sandbox.cleanup()

    def create(self, **changes):
        return helper.create_product(self.data | changes, self.repo, write=True)

    def test_preview_is_read_only_and_write_keeps_variant_url_and_unknown_price(self):
        preview = helper.create_product(self.data, self.repo)
        self.assertFalse(Path(preview["path"]).exists())
        created = self.create()
        body = Path(created["path"]).read_text()
        self.assertIn(self.data["url"], body)
        self.assertIn('price: null', body)
        self.assertIn('currency: "USD"', body)
        self.assertIn('archived: false', body)
        self.assertTrue(created["written"])

    def test_refuses_duplicate_link_even_archived_and_tracking_differences(self):
        product = Path(self.create()["path"])
        product.write_text(product.read_text().replace("archived: false", "archived: true"))
        with self.assertRaisesRegex(helper.ProductError, "Lien déjà enregistré"):
            self.create(id="another", url="https://EXAMPLE.com/p?size=M&utm_source=test&color=31")

    def test_refuses_overwrite_without_changing_existing_file(self):
        product = Path(self.create()["path"])
        before = product.read_bytes()
        with self.assertRaisesRegex(helper.ProductError, "aucun écrasement"):
            self.create(title="Changed")
        self.assertEqual(product.read_bytes(), before)

    def test_same_reference_needs_explicit_distinct_variant(self):
        self.create()
        with self.assertRaisesRegex(helper.ProductError, "Référence déjà présente"):
            self.create(id="duplicate", url="https://another.example/item", variant={"color": "31", "size": "m"})
        with self.assertRaisesRegex(helper.ProductError, "Référence déjà présente"):
            self.create(id="ambiguous", url="https://another.example/item", variant={"color": "31"})
        different = self.create(id="other-size", url="https://example.com/p?color=31&size=L", variant={"color": "31", "size": "L"})
        self.assertTrue(different["written"])
        self.assertEqual(len(different["warnings"]), 2)

    def test_price_requires_regular_basis_source_evidence_and_date(self):
        for extra in ({"priceBasis": "sale"}, {"priceBasis": "regular"}, {"priceBasis": "regular", "priceEvidence": "Regular $59.90", "priceCheckedAt": "2026-02-30"}):
            with self.assertRaises(helper.ProductError):
                self.create(price=59.9, **extra)
        result = self.create(price=59.9, priceBasis="regular", priceEvidence="Regular $59.90 shown on selected variant", priceCheckedAt="2026-11-23")
        body = Path(result["path"]).read_text()
        self.assertIn("price: 59.9", body)
        self.assertIn('currency: "USD"', body)
        self.assertIn("Source du prix initial : " + self.data["url"], body)

    def test_refuses_invalid_prices_currency_archive_and_paths(self):
        for change in ({"price": -1}, {"price": True}, {"price": float("inf")}, {"currency": "eur"}, {"archived": True}, {"id": "../escape"}, {"image": "/images/../../escape.webp"}, {"url": "javascript:alert(1)"}):
            with self.subTest(change=change), self.assertRaises(helper.ProductError):
                self.create(**change)

    def test_existing_complex_yaml_fails_closed(self):
        (self.repo / "src/content/products/existing.md").write_text("---\ntitle: Existing\nurl: >-\n  https://example.com/old\n---\n")
        with self.assertRaisesRegex(helper.ProductError, "YAML complexe"):
            self.create()

    def test_cli_finds_repo_and_rejects_duplicate_without_side_effects(self):
        payload = self.repo / "input.json"
        payload.write_text(json.dumps(self.data))
        command = [sys.executable, str(HELPER), "--input", str(payload), "--write"]
        first = subprocess.run(command, cwd=self.repo / "src", capture_output=True, text=True)
        self.assertEqual(first.returncode, 0, first.stderr)
        self.assertTrue(json.loads(first.stdout)["written"])
        second = subprocess.run(command, cwd=self.repo, capture_output=True, text=True)
        self.assertEqual(second.returncode, 2)
        self.assertEqual(len(list((self.repo / "src/content/products").glob("*.md"))), 1)


if __name__ == "__main__":
    unittest.main()
