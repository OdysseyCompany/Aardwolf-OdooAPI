# Sử dụng hình ảnh Odoo 17 chính thức
FROM odoo:17

# Chuyển sang người dùng root để có quyền cài đặt các packages nếu cần
USER root
COPY ./etc/requirements.txt /etc/odoo/requirements.txt
RUN pip3 install pip --upgrade
RUN pip3 install -r /etc/odoo/requirements.txt

# Sao chép các tập tin cần thiết từ thư mục local vào container
COPY ./addons /mnt/extra-addons

#COPY ./addons_hrm /mnt/hrm-addons
COPY ./etc /etc/odoo

COPY ./addons_crm /mnt/crm-addons
#COPY ./addons_hrm /mnt/hrm-addons

# Expose các cổng dịch vụ
EXPOSE 8069 8072
