/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView,Slider} from 'nuke';


class SliderDemo extends Component {
    constructor() {
        super();
        
    }

    sliderChange(e){

    }
   
    render() {
        return (
            <View>
                <View style={app.showTitle}><Text style={app.showTitleText}>Slider</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>普通slider</Text></View>
                <Slider width="750rem" height="400rem"
                        autoplay="false"
                        showsPagination="true"
                        loop="true"
                        autoplayTimeout="3000"
                        paginationStyle={app.paginationStyle}
                        onChange={this.sliderChange.bind(this)}>
                        <View style={app.slide1p1}>step1</View>
                        <View style={app.slide1p2}>step2</View>
                        <View style={app.slide1p3}>step3</View>
                      </Slider>
            </View>
        );
    }
}


mount(<SliderDemo />, 'body');