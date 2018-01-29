/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,ScrollView,TextInput} from 'nuke';
import app from './app.rxscss';
const isWeex = typeof callNative !== 'undefined';

import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView} from 'nuke';



class InputDemo extends Component {
    constructor() {
        super();
        this.state = {
            abc:'',
            valid1:'',
            valid2:''
        }
    
    }
    change(e) {
        console.log(e)
        let value=e.value || e.target.value || '';
        // console.log('input e',e.target.value);
        // if(e.value){
        //      this.setState({
        //         abc:  e.value || e.target.vaule
        //     }) 
        // }else
        this.setState({
            abc: value
        }) 
        console.log(this.state)
    }
    validate(result,key,e) {
        var obj={};
        obj[key]=result;
        this.setState(obj);
    }
    render(){
        var self=this;
        return (
            <ScrollView>
                <View style={app.showTitle}><Text style={app.showTitleText}>Input</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>普通input</Text></View>
                <View style={app.inputContainer}>
                    {/*<input
                     style={{borderColor:"#dddddd",borderStyle:"solid",borderWidth:"1rem",width:"750rem",height:"80rem",flex:1}}
                        onChange={(e) => console.log('onChange',e)}
                        
                        
                        onchange={(e) => console.log('小写的onchange',e)}
                        onfocus={(e) => console.log('小写的onfocus',e)}
                        oninput={(e) => console.log('小写的oninput',e)}
                        />*/}
                    <Input ref="myinput" placeholder="搜一搜..." onChange={this.change.bind(this)} onFocus={(e) => console.log('onFocus',e)}
                        onBlur={(e) => console.log('onBlur',e)}
                        onInput={(e) => console.log('onInput',e)}/>
                    
                </View>
                <View style={app.inputContainer}>
                    <Text>输入的内容是：{this.state.abc}</Text>
                    
                </View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>成功有提示</Text></View>
                <View style={app.inputContainer}>
                <Input hasFeedback="true" onChange={this.validate.bind(this,'success','valid1')} state={this.state.valid1} />
                </View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>失败有提示</Text></View>
                <View style={app.inputContainer}>
                    <Input hasFeedback="true" placeholder="请输入..." onChange={this.validate.bind(this,'error','valid2')} state={this.state.valid2} />
                </View>   
                
            </ScrollView>
        )
    }
}


mount(<InputDemo />, 'body');