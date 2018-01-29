/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView} from 'nuke';

let listHeader = <View style={app.listHeader}><Text style={app.showTitleText}>list</Text></View>;
let listLoading = <View style={app.loading}><Text style={app.loadingText}>加载中...</Text></View>;
let listRefresh = <View style={app.refresh}>下拉刷新</View>;
let listData = [];
for (var i = 0; i < 30; i++) {
    listData.push({key: i,pic:'//img.alicdn.com/bao/uploaded/i1/TB1gdT4KVXXXXcpXFXXwu0bFXXX.png',text:'近三个月订单'});
}


class ButtonDemo extends Component {
    constructor() {
        super();
        this.state = {
            data: listData,
            stop: false
        };
        this.index = 0;
    
    }
    handleLoadMore() {
        var self = this;
        // 这里进行异步操作
        setTimeout(function() {
          self.index++;
          if (self.index == 5) {
            self.state.stop = true; // 加载5次后会停止加载，并去掉菊花
          }
          self.state.data.push({key: 'x',pic:'//img.alicdn.com/bao/uploaded/i1/TB1O9eAKVXXXXaPaXXXwu0bFXXX.png',text:'xx订单'}, {key: 'loadmore 2',pic:'//img.alicdn.com/bao/uploaded/i1/TB1O9eAKVXXXXaPaXXXwu0bFXXX.png',text:'xx订单'}, {key: 'loadmore 2',pic:'//img.alicdn.com/bao/uploaded/i1/TB1O9eAKVXXXXaPaXXXwu0bFXXX.png',text:'xx订单'},{key: 'loadmore 2',pic:'//img.alicdn.com/bao/uploaded/i1/TB1O9eAKVXXXXaPaXXXwu0bFXXX.png',text:'xx订单'}, {key: 'loadmore 2',pic:'//img.alicdn.com/bao/uploaded/i1/TB1O9eAKVXXXXaPaXXXwu0bFXXX.png',text:'xx订单'});
          self.setState(self.state);
        }, 1000);
    }
    linkTo(item,e) {
        console.log(e);
    }
    renderItem (item, index){
        return <TouchableHighlight style={app.cellItemList} onPress={this.linkTo.bind(this,item)}>
                <Icon src={item.pic} style={app.itemIcon} />
                <Text style={app.itemTextList}>{item.text}</Text>
                <Icon style={app.itemArrow} src="//img.alicdn.com/tfs/TB1EU2rMVXXXXcpXXXXXXXXXXXX-64-64.png" />
            </TouchableHighlight>;
  
    }
    separate(item, index) {
        if  (index % 4 == 3) {
            return <View style={app.separator}></View>;
      
        }
      
    } 
    render(){
        var self=this;
        return (
                <ListView 
            header={listHeader}
            fixHeader={false}
            loadMoreOffset="500"
            style={app.listContainer}
            refresh={listRefresh}
            onloading={self.onloading}
            onrefresh={self.onrefresh}
            renderSeparator={self.separate.bind(self)}
            renderRow={self.renderItem.bind(self)} 
            data={self.state.data}
            stop={self.state.stop}
            loadMore={self.handleLoadMore.bind(self)} 
          />

        )
    }
}


mount(<ButtonDemo />, 'body');