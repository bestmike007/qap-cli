/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,Navigator} from 'nuke';



class NavigatorDemo extends Component {
    constructor() {
        super();
        
    
    }
    linkToWeex(){
       Navigator.push('qap://list.js','列表'); 
    }
    linkToH5(){
    	Navigator.push('https://m.taobao.com','','h5'); 
    }
    render(){
        var self=this;
        return (
            <View>
                <View style={app.showTitle}><Text style={app.showTitleText}>Navigator</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>链接到下一个weex 页面</Text></View>
               
                <View style={app.btnGroupBlock}>
                    <Button style={app.btnItemBlock} onPress={this.linkToWeex.bind(this)} block="true" type="primary">点我到list</Button>
                </View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>链接到下一个普通webview页面</Text></View>
               
                <View style={app.btnGroupBlock}>
                    <Button style={app.btnItemBlock} onPress={this.linkToH5.bind(this)} block="true" type="primary">点我到淘宝h5</Button>
                </View>
                
                
            </View>
        )
    }
}


mount(<NavigatorDemo />, 'body');