/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView,Radio} from 'nuke';

const dataSource = [
    {value:'apple', label: '苹果'},
    {value:'peal', label: '梨'},
    {value:'orange', label: '橘子'}
];

class RadioDemo extends Component {
    constructor() {
        super();
        this.state = {
            value:''
        }
        
    
    }
    
    press(value){
        let tmp = value;
        this.setState({
            value:tmp
        });
        console.log(this.state);
    }
    // onChange(value){
    //     console.log('checked',value);
    // } 

    render(){
        var self=this;
        return (
            <ScrollView>
                <View style={app.showTitle}><Text style={app.showTitleText}>Radio</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>normal</Text></View>
                <View style={app.btnGroup}>
                   <Radio.Group value={this.state.value} horizontal="true" onChange={ this.press.bind(this) } size="small" dataSource={ dataSource }></Radio.Group>
                </View>

                
            </ScrollView>
        )
    }
}


mount(<RadioDemo />, 'body');