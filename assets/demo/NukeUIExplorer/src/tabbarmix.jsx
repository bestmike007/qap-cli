/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView,Tabbar} from 'nuke';
let listLoading = <View style={app.loading}><Text style={app.loadingText}>加载中...</Text></View>;
let listRefresh = <View style={app.refresh}>下拉刷新</View>;
let listData = [];
for (var i = 0; i < 30; i++) {
    listData.push({key: i,pic:'//img.alicdn.com/bao/uploaded/i1/TB1gdT4KVXXXXcpXFXXwu0bFXXX.png',text:'近三个月订单'});
}

class TabbarDemo extends Component {
    constructor() {
        super();
        this.state =  {
            selectedTab: 'redTab',
            notifCount: 0,
            presses: 0,
            data: listData,
            stop: false
        };
    
    }

    _renderContent(color, pageText, num) {
        return (
          <View style={[app.tabContent, {backgroundColor: color}]}>
            <Text>{pageText}</Text>
          </View>
        );
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
    renderList(){
        var self=this;
        return (
          <ListView 
            fixHeader={false}
            loadMoreOffset="500"
            style={app.listContainer}
            refresh={listRefresh}
            loading={listLoading}
            onloading={self.onloading}
            onrefresh={self.onrefresh}
            renderSeparator={self.separate.bind(self)}
            renderRow={self.renderItem.bind(self)} 
            data={self.state.data}
            stop={self.state.stop}
            loadMore={self.handleLoadMore.bind(self)} 
          />
        );
    }
    renderFirstTab(){
        return (
            <View style={[app.tabContent]}>
                <Tabbar navTop={true} navScrollable={false}>
                    <Tabbar.Item
                        title="全部"
                        selected={this.state.selectedTab === 'allorders'}
                        onPress={() => {
                        this.setState({
                          selectedTab: 'allorders',
                        });
                      }}>
                      {this.renderList()}

                    </Tabbar.Item>
                    <Tabbar.Item
                      title="已发货"
                      badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
                      selected={this.state.selectedTab === 'delivered'}
                      onPress={() => {
                        this.setState({
                          selectedTab: 'delivered',
                          notifCount: this.state.notifCount + 1,
                        });
                      }}>
                      {this._renderContent('#783E33', '已买到', this.state.notifCount)}
                    </Tabbar.Item>
                    <Tabbar.Item
                      renderAsOriginal
                      title="已卖出"
                      selected={this.state.selectedTab === 'sold'}
                      onPress={() => {
                        this.setState({
                          selectedTab: 'sold',
                          presses: this.state.presses + 1
                        });
                      }}>
                      {this._renderContent('#783E33', '已卖出', this.state.notifCount)}
                    </Tabbar.Item>
                    
                </Tabbar>
            </View>
        )
    }
    render() {
        return (
            <Tabbar iconBar={true} style={app.tabbar}>
                <Tabbar.Item
                    title="Blue Tab"
                    selected={this.state.selectedBar === 'blueTab'}
                    icon={{src: '//img.alicdn.com/tfs/TB1cCLYMVXXXXXHXpXXXXXXXXXX-64-64.png',selected:'//img.alicdn.com/tfs/TB1MzYIMVXXXXXYXVXXXXXXXXXX-64-64.png'}}
                    onPress={() => {
                    this.setState({
                      selectedBar: 'blueTab',
                    });
                  }}>
                  {this.renderFirstTab()}
                </Tabbar.Item>
                <Tabbar.Item
                  title="Red Tab"
                  icon={{src: '//img.alicdn.com/tfs/TB1aoTvMVXXXXaKaXXXXXXXXXXX-64-64.png',selected:'//img.alicdn.com/tfs/TB1AZ_yMVXXXXX8aXXXXXXXXXXX-64-64.png'}}
                  badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
                  selected={this.state.selectedBar === 'redTab'}
                  onPress={() => {
                    this.setState({
                      selectedBar: 'redTab',
                      notifCount: this.state.notifCount + 1,
                    });
                  }}>
                  {this._renderContent('#783E33', 'Red Tab 大家好我是红色的区域', this.state.notifCount)}
                </Tabbar.Item>
                <Tabbar.Item
                  renderAsOriginal
                  title="More"
                  icon={{src: '//img.alicdn.com/tfs/TB1UsjYMVXXXXXaXpXXXXXXXXXX-64-64.png',selected:'//img.alicdn.com/tfs/TB12mLPMVXXXXa5XFXXXXXXXXXX-64-64.png'}}
                  selected={this.state.selectedBar === 'greenTab'}
                  onPress={() => {
                    this.setState({
                      selectedBar: 'greenTab',
                      presses: this.state.presses + 1
                    });
                  }}>
                  {this._renderContent('#21551C', 'Green Tab 大家好我是绿色的', this.state.presses)}
                </Tabbar.Item>
                 <Tabbar.Item
                  renderAsOriginal
                  title="More"
                  icon={{src: '//img.alicdn.com/tfs/TB1.rPuMVXXXXc1aXXXXXXXXXXX-64-64.png',selected:'//img.alicdn.com/tfs/TB1qW2uMVXXXXcUaXXXXXXXXXXX-64-64.png'}}
                  selected={this.state.selectedBar === 'greenTab'}
                  onPress={() => {
                    this.setState({
                      selectedBar: 'greenTab',
                      presses: this.state.presses + 1
                    });
                  }}>
                  {this._renderContent('#21551C', 'Green Tab 大家好我是绿色的', this.state.presses)}
                </Tabbar.Item>
            </Tabbar>
        );
    }
    }


mount(<TabbarDemo />, 'body');