'use strict';
import { mount } from 'weex-rx-mounter';
import { createElement, Component } from 'weex-rx';
import { View, Text, Modal } from 'nuke';

import QN from 'QAP-SDK';

class Demo extends Component {

    constructor(props) {
        super(props);
        //apiResultL存放结果
        //更新apiResultL后，该组件会自动刷新
        this.state = { apiResult: "" }

        var params = {
            "fields": "tid,num,created,pay_time,status,buyer_message,seller_memo,seller_flag,buyer_nick,receiver_name,receiver_mobile,receiver_phone,receiver_state,consign_time,title,receiver_city,receiver_district,receiver_address,receiver_zip,seller_rate,seller_can_rate,buyer_rate,payment,post_fee,type,seller_nick,shipping_type,total_fee,modified,has_buyer_message,credit_card_fee,end_time,seller_rate,is_part_consign,orders.oid,orders.pic_path,orders.title,orders.outer_iid,orders.outer_sku_id,orders.sku_properties_name,orders.price,orders.num,orders.adjust_fee,orders.payment,orders.refund_status,orders.status,orders.shipping_type,orders.seller_rate,orders.num_iid,orders.consign_time,orders.logistics_company,buyer_alipay_no,trade_from",
            "start_created": "2016-04-21 00:00:00",
            "type": "fixed,auction,guarantee_trade,step,independent_simple_trade,independent_shop_trade,auto_delivery,ec,cod,game_equipment,shopex_trade,netcn_trade,external_trade,instant_trade,b2c_cod,hotel_trade,super_market_trade,super_market_cod_trade,taohua,waimai,nopaid,eticket,tmall_i18n,nopaid,insurance_plus,finance,pre_auth_type",
            "format": "json",
            "end_created": "2016-07-20 23:59:59",
            "page_size": "10",
            "page_no": "1",
        };

        QN.top.invoke({
            api: 'taobao.trades.sold.get',
            query: params,
            settings: { timeout: 2000 },
            success: this.successCallback.bind(this),
            error(err) {
                //失败时弹toast提示用户错误原因
                Modal.toast(JSON.stringify(err));
            }
        })
    }

    successCallback(data) {
        this.setState({apiResult:JSON.stringify(data)})
    }

    render() {
        return (
            <View style={styles.container}>
                <h5>{this.state.apiResult}</h5>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
};

mount(<Demo />, 'body');

export default Demo;
