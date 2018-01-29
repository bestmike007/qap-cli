/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView,Modal} from 'nuke';



class ButtonDemo extends Component {
    constructor() {
        super();
        
    
    }
    press(){
        Modal.toast('hi');
    }
    render(){
        var self=this;
        return (
            <ScrollView>
                <View style={app.showTitle}><Text style={app.showTitleText}>Button</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>normal</Text></View>
                <View style={app.btnGroup}>
                    <Button style={app.btnItem} onPress={this.press.bind(this)} type="normal">normal</Button>
                    <Button style={app.btnItem} onPress={this.press.bind(this)} type="primary">primary</Button>
                    <Button style={app.btnItem} onPress={this.press.bind(this)} type="secondary">secondary</Button>
                </View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>block button</Text></View>
                <View style={app.btnGroupBlock}>
                    <Button style={app.btnItemBlock} onPress={this.press.bind(this)} block="true" type="normal">block normal</Button>
                    <Button style={app.btnItemBlock} onPress={this.press.bind(this)} block="true" type="primary">block primary</Button>
                    <Button style={app.btnItemBlock} onPress={this.press.bind(this)} block="true" type="secondary">block secondary</Button>
                </View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}> button size</Text></View>
                <View style={app.btnGroup}>
                    <Button style={app.btnItem} onPress={this.press.bind(this)} type="primary" size="large">large</Button>
                    <Button style={app.btnItem} onPress={this.press.bind(this)} type="primary">medium</Button>
                    <Button style={app.btnItem} onPress={this.press.bind(this)} type="primary" size="small">small</Button>
                </View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}> button width icon</Text></View>
                <View style={app.btnGroup}>
                    <Button style={app.btnItem} onPress={this.press.bind(this)} icon="//img.alicdn.com/tfs/TB1t7x_LpXXXXbLXFXXXXXXXXXX-64-64.png" type="secondary">带图片</Button>
                    <Button loading="true" style={app.btnItem} onPress={this.press.bind(this)} type="secondary">loading</Button>
                </View>
                
            </ScrollView>
        )
    }
}


mount(<ButtonDemo />, 'body');