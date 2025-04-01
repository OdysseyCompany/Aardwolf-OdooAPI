from datetime import datetime
from pytz import timezone

def convert_sdt(sdt):
    if not sdt:
        return False

    # Lấy chỉ các ký tự số từ sdt
    sdt_numeric = ''.join(filter(str.isdigit, sdt))

    # Loại bỏ mã quốc gia +84 nếu có
    if sdt_numeric.startswith('84') and len(sdt_numeric) == 11:
        sdt_numeric = '0' + sdt_numeric[2:]

    # Định dạng lại số điện thoại
    if len(sdt_numeric) == 9:
        sdt_numeric = '0' + sdt_numeric
    if len(sdt_numeric) == 10 and sdt_numeric.startswith('0'):
        return f"+84{sdt_numeric[1:]}"

    # Trả về giá trị gốc nếu không đúng định dạng
    return sdt


class LogUtil(object):

    def create_log_history_partner(self, action=False, location=False, description=False):
        if self and action:
            try:
                insert_history = {
                    'partner_id': self.id,
                    'action_id': action.id,
                    'location': location,
                    'description': description if description else '',
                    'create_date': datetime.now(),
                }
                query_insert_history = '''
                                INSERT INTO history_contact (partner_id, action_id, location, description, create_date)
                                VALUES (
                                    %(partner_id)s, %(action_id)s, %(location)s, %(description)s, %(create_date)s
                                ) 
                            '''
                self.env.cr.execute(query_insert_history, insert_history)
            except Exception as e:
                print(e)
                raise e




