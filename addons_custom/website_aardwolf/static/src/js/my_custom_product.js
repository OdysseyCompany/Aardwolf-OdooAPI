/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import PatchedVariantMixin from "@website_aardwolf/js/custom_variant_mixin";


publicWidget.registry.MyCustomProduct = publicWidget.Widget.extend(PatchedVariantMixin, {
    selector: ".oe_website_sale",
    start() {
        console.log("💡 Widget with custom VariantMixin loaded");
        return this._super.apply(this, arguments);
    },
});
