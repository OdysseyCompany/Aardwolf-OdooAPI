/** @odoo-module **/

import VariantMixin from "@website_sale/js/sale_variant_mixin";
import { rpc } from "@web/core/network/rpc";

// Tạo bản override
const CustomVariantMixin = {
    // Override hàm
    _getCombinationInfo: function (ev) {
        if ($(ev.target).hasClass('variant_custom_value')) {
            return Promise.resolve();
        }
        console.log('_getCombinationInfo33333333333')
        const $parent = $(ev.target).closest('.js_product');
        if (!$parent.length) {
            return Promise.resolve();
        }
        const combination = this.getSelectedVariantValues($parent);

        return rpc('/website_sale/get_combination_info', {
            'product_template_id': parseInt($parent.find('.product_template_id').val()),
            'product_id': this._getProductId($parent),
            'combination': combination,
            'add_qty': parseInt($parent.find('input[name="add_qty"]').val()),
            'parent_combination': [],
            'context': this.context,
            ...this._getOptionalCombinationInfoParam($parent),
        }).then((combinationData) => {
            if (this._shouldIgnoreRpcResult()) {
                return;
            }

            // Gọi các hàm xử lý như cũ
            this._onChangeCombination(ev, $parent, combinationData);
            this._checkExclusions($parent, combination, combinationData.parent_exclusions);

            // ✅ THÊM specifications vào HTML
            if (combinationData.specifications) {
                const $specContent = $('.toolrange__prod-detail__specifications-content');
                if ($specContent.length) {
                    // ✅ Xoá nội dung cũ trước
                    $specContent.empty();

                    // ✅ Gán nội dung mới
                    $specContent.html(combinationData.specifications);
                }
            }
        });
    },

};

// Kết hợp cả hai
const PatchedVariantMixin = {
    ...VariantMixin,
    ...CustomVariantMixin,
};

export default PatchedVariantMixin;
