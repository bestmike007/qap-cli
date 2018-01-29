/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView} from 'nuke';



class ViewDemo extends Component {
    constructor() {
        super();
        this.state={
            xStyle:{
                flex:1,
                height:'200rem',
                borderWidth:'10rem',
                borderStyle: 'solid',
                borderColor:'yellow',
                borderRadius:'12rem'
                
            }

        }
    
    }
    press(){
        this.setState({
            xStyle:{
                height:'100rem',
                backgroundColor:'red'

            }
        });
    }
    press2(){
        this.setState({
            xStyle:{
                flex:1,
                height:'200rem',
                borderWidth:'10rem',
                borderStyle: 'solid',
                borderColor:'yellow',
                borderRadius:'12rem'
            }
        });
    }
    render(){
        var self=this;
        return (
            <ScrollView>
                <View style={app.showTitle}><Text style={app.showTitleText}>View</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>带边框</Text></View>
                <View style={app.viewGroup}>
                    <View style={app.viewBorderSolid}></View>
                </View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>圆角</Text></View>
                <View style={[app.viewGroup,{height:'300rem'}]}>
                    <View style={this.state.xStyle}></View>
                </View>
                <View style={app.sepNormal}>
                    <Button type="primary" onPress={this.press.bind(this)}>修改楼上的背景和高度</Button>
                </View>
                <View style={app.viewGroup}>
                    <Button type="primary" onPress={this.press2.bind(this)}>改回来</Button>
                </View>
               
                
            </ScrollView>
        )
    }
}


mount(<ViewDemo />, 'body');