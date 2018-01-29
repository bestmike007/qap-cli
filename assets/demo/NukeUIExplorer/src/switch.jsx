/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView,Switch} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView} from 'nuke';



class SwitchDemo extends Component {
    constructor() {
        super();
        this.state={
            trueSwitchIsOn: true,
            falseSwitchIsOn: false
        }
    
    }
    press(){
        
    }
    render(){
        var self=this;
        return (
            <ScrollView>
                <View style={app.showTitle}><Text style={app.showTitleText}>Switch</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>normal</Text></View>
                <View style={app.btnGroup}>
                    <Switch onTintColor={'green'} tintColor={'#ffffff'} thumbTintColor={'blue'}
                      onValueChange={(value) =>this.setState({falseSwitchIsOn: value})}
                      value={this.state.falseSwitchIsOn}/>
                    <Switch
                      onValueChange={(value) =>this.setState({trueSwitchIsOn: value})}
                      value={this.state.trueSwitchIsOn}/>
                </View>
                
                
            </ScrollView>
        )
    }
}


mount(<SwitchDemo />, 'body');