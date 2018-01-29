/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView} from 'nuke';
import Util from 'nuke-util';
let Dimensions=Util.Dimensions;
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView} from 'nuke';
const isWeex = typeof callNative !== 'undefined';
const isWeb = typeof window === 'object';

let deviceHeight=Dimensions.get('window').height;
class App extends Component {
  constructor(props) {
    super(props);
    this.tabs = [{
      src: 'qap://button.js',
      webSrc: 'http://30.5.107.11:3050/index.html?dist=/build/&we=button.js',
      text: '首页',
      visibility: 'visible',
      index: 0,
      isWeex: true
    }, {
      src: 'qap://input.js',
      webSrc: 'http://30.5.107.11:3050/index.html?dist=/build/&we=input.js',
      text: '发现',
      visibility: 'hidden',
      index: 1,
      isWeex: true
    }, {
      src: 'qap://text.js',
      webSrc: 'https://m.taobao.com',
      text: '消息',
      visibility: 'hidden',
      index: 2,
      isWeex: true
    }, {
      src: 'qap://view.js',
      webSrc: 'https://m.taobao.com',
      text: '我',
      visibility: 'hidden',
      index: 3,
      isWeex: true
    }];
    let selectedIndex = 0;
    // if (match && match[1]) {
    //   selectedIndex = parseInt(match[1]);
    // }
    this.state = {
      selectedIndex: selectedIndex
    };
  }
  renderTab(){
    let arr=[];
    this.tabs.forEach((tab) => { 
      console.log(tab.text);

      arr.push(<View style={app.testtab}>
              <Text>{tab.text}</Text>
            </View>)
    });
    return arr;
  }
  render() {
    return <View style={app.container}>
      
        <View t="tabwrap" style={app.testtabwrap}>
          {
            this.renderTab()
          }
          
      </View>
    </View>;
  }

  selected(index) {
    this.setState({
      selectedIndex: index
    });
  }
}

mount(<App />, 'body');