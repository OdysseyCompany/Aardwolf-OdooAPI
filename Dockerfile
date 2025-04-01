# Sử dụng hình ảnh Odoo 17 chính thức
FROM odoo:18
ENV PYTHONPATH /usr/lib/python3/site-packages:$PYTHONPATH
# Chuyển sang người dùng root để có quyền cài đặt các packages nếu cần
USER root
COPY ./etc/requirements.txt /etc/odoo/requirements.txt
RUN pip3 install pip --upgrade
RUN pip3 install -r /etc/odoo/requirements.txt
RUN pip3 install pyjwt==1.6.4
RUN pip3 install simplejson==3.17.5

# Sao chép các tập tin cần thiết từ thư mục local vào container
COPY ./addons_custom /mnt/addons_custom

#COPY ./addons_hrm /mnt/hrm-addons
COPY ./etc /etc/odoo

# Expose các cổng dịch vụ
EXPOSE 8069 8072
