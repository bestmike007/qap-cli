/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView,Modal} from 'nuke';



class ModalDemo extends Component {
    constructor() {
        super();
        
    
    }
    press(){
        Modal.confirm({content:'真的要这样了，你确定吗？'});
    }
    alert() {
        Modal.alert('Hi');
    }
    confirm(){
        Modal.confirm('是否确认', (result) => {});
    }
    prompt(){
        Modal.prompt('请输入', (result) => {
            console.log(result);
        });
    }
    toast(){
        Modal.toast('hi');
    }
    render(){
        var self=this;
        return (
            <ScrollView>
                <View style={app.showTitle}><Text style={app.showTitleText}>Modal</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>alert</Text></View>
                <View style={app.btnContainer}>
                    <Button onPress={this.alert.bind(this)} type="primary" block="true" size="large" style={app.btns}>alert</Button>
                </View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>confirm</Text></View>
                <View style={app.btnContainer}>
                    <Button onPress={this.confirm.bind(this)} block="true" size="large" type="primary" style={app.btns}>confirm</Button>
                </View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>prompt</Text></View>
                <View style={app.btnContainer}>
                    <Button onPress={this.prompt.bind(this)} block="true" size="large" type="primary" style={app.btns}>prompt</Button>
                </View>  
                <View style={app.sepNormal}><Text style={app.sepNormalText}>toast</Text></View>
                <View style={app.btnContainer}>
                    <Button onPress={this.toast.bind(this)} block="true" size="large" type="primary" style={app.btns}>toast</Button>
                </View>  
            </ScrollView>
        )
    }
}


mount(<ModalDemo />, 'body');