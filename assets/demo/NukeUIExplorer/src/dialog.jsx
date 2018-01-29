/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView} from 'nuke';
import Util from 'nuke-util';
import Dialog from 'nuke-dialog';

let Dimensions=Util.Dimensions;

let {height} = Dimensions.get('window');

class DialogDemo extends Component {


  render() {
    return (
        <View style={styles.wrapper}>
            <TouchableHighlight style={styles.click} onPress={this.showModal}>
              <Text>自定义对话框</Text>
            </TouchableHighlight>
            <Dialog ref="modal" contentStyle={styles.modalStyle} onShow={this.onShow} onHide={this.onHide}>
                <View style={styles.body}>
                    <Text>
                      Conetnt
                    </Text>
                </View>
                <View style={styles.footer}>
                    <TouchableHighlight style={styles.button} onPress={this.hideModal}>
                        <Text>OK</Text>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight style={styles.close} onPress={this.hideModal}>
                    <Text style={styles.closeText}>x</Text>
                </TouchableHighlight>
            </Dialog>
        </View>
    );
  }

  showModal = () => {
    this.refs.modal.show();
  };

  hideModal = () => {
    this.refs.modal.hide();
  };

  onShow = (param) => {
    console.log('modal show', param);
  };

  onHide = (param) => {
    console.log('modal hide', param);
  };
}

var styles = {
  wrapper: {
    height: height,
    paddingLeft: '24rem',
    paddingRight: '24rem',
    paddingTop: '24rem'
  },
  click: {
    height: '100rem',
    lineHeight: '100rem',
    textAlign: 'center',
    borderWidth: '1rem',
    borderStyle: 'solid',
    borderColor: '#ccc'
  },
  modalStyle: {
    width: '640rem',
    height: '340rem'
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
    height: '220rem'
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '120rem'
  },
  button: {
    width: '300rem',
    height: '60rem',
    borderWidth: '1rem',
    borderStyle: 'solid',
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center'
  },
  close: {
    borderWidth: '1rem',
    borderStyle: 'solid',
    borderColor: '#ccc',
    position: 'absolute',
    top: '-18rem',
    right: '-18rem',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40rem',
    height: '40rem',
    borderRadius: '20rem',
    backgroundColor: '#ffffff'
  },
  closeText: {
    fontSize: '28rem',
    color: '#000000'
  }
};



mount(<DialogDemo />, 'body');