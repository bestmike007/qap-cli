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
      src: 'qap://listview.js',
      text: '首页',
      visibility: 'visible',
      index: 0,
      isWeex: true
    }, {
      src: 'qap://input.js',
      text: '发现',
      visibility: 'hidden',
      index: 1,
      isWeex: true
    }, {
      src: 'qap://text.js',
      text: '消息',
      visibility: 'hidden',
      index: 2,
      isWeex: true
    }, {
      src: 'qap://view.js',
      text: '我',
      visibility: 'hidden',
      index: 3,
      isWeex: true
    }];
    // let match = Location.search.match(/[\&|\?]tab=(\d+)/),
    let selectedIndex =0;
    // if (match && match[1]) {
    //   selectedIndex = parseInt(match[1]);
    // }
    this.state = {
      selectedIndex: selectedIndex
    };
  }
  selected(index) {
    this.setState({
      selectedIndex: index
    });
    console.log(this.state);
  }
  renderTab(){
  	let arr=[];
  	this.tabs.forEach((tab) => { 

  		arr.push(<View style={app.tab} onClick={this.selected.bind(this, tab.index)}>
              <Text style={this.state.selectedIndex === tab.index ? app.tabSelectedText : {}}>{tab.text}</Text>
            </View>)
  	});
  	return arr;
  }
  render() {
    return <View style={app.container}>
      {
        this.tabs.map((tab, index) => {
          return <View>
            {(() => {
                if (isWeb) {
                  	return <iframe src={tab.webSrc} style={app.iframe,{height:deviceHeight * 2}} frameBorder="0" />;
                } else {
                  	if (tab.isWeex) {
                        let embedStyle=[{visibility: this.state.selectedIndex === index ? "visible" : "hidden"},{width: '750rem',height: parseInt(deviceHeight) + 100 + 'rem',position: 'fixed',bottom: 0,left:0,right:0,top:0}];
                        console.log('embedStyle',embedStyle);
                      return <embed src={tab.src} style={embedStyle} type="weex" />;
                 	} else {
                    	return <ScrollView style={{
                      	width: '750rem',
                      	height: parseInt(deviceHeight) + 100 + 'rem'
                    	}}>
                      	<web src={tab.src} style={{
                        	width: '750rem',
                        	height: parseInt(deviceHeight) + 100 + 'rem'
                      	}} />
                    </ScrollView>;
                  }
                }
            })()}
          </View>;
        })
      }
      	<View style={app.tabwrap}>
	        {
	          this.renderTab()
	        }
        	
      </View>
    </View>;
  }

  
}

mount(<App />, 'body');