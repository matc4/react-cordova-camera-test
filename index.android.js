'use strict';

var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NativeModules,
    TouchableHighlight,
    ListView
} = React;

var cordova = require('react-native-cordova-plugin');
window.cordova = cordova;
window.react = React;

var EasyTest = React.createClass({
    log: function(status) {
        return function(res) {
                this.setState({
                    status: status,
                    result: res
                })
            }
    },
    getInitialState: function() {
        return {
            result: '',
            status: 'Initialized'
        };
    },
    getPlugins: function() {
        var self = this;

        var logDevice = function(status) {
            return function(res) {
                self.setState({
                    status: status,
                    result: res.model
                })
            }
        }

        var log = function(status) {
            return function(res) {
                self.setState({
                    status: status,
                    result: res
                })
            }
        }
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        //return ds.cloneWithRows(['row 1', 'row 2']);
        return ds.cloneWithRows([{
            name: 'Device (cordova-plugin-device)',
            fn: function() {
                cordova.device.getInfo(logDevice('success'), logDevice('fail')); 
            }
        }, {
            name: 'Network Info (cordova-plugin-network-info)',
            fn: function() {
                cordova.navigator.connection.getInfo(log('success'), log('fail'));
            }
        }, {
            name: 'Pick Contact (cordova-plugin-contact)',
            fn: function() {
                cordova.navigator.contacts.pickContact(log('success'), log('fail'));
            }
        }, {
            name: 'Take Picture (cordova-plugin-camera)',
            fn: function() {
                cordova.navigator.camera.getPicture(log('success'), log('fail'), {
                    saveToPhotoAlbum: true,
                });
            }
        }, {
            name: 'Barcode Scanner (phonegap-plugin-barcodescanner)',
            fn: function() {
                cordova.cordova.plugins.barcodeScanner.scan(log('success'), log('fail'));
            }
        }, {
            name: 'Show Dialogs (cordova-plugins-dialog)',
            fn: function() {
                cordova.navigator.notification.alert('This message was created by the cordova-plugin-dialog', function() {
                    log('success')('Alert dialog closed successuflly');
                }, 'React Native + Cordova Plugins', 'Close this dialog')
            }
        }, {
            name: 'Get Direction (cordova-plugin-device-orientation)',
            fn: function() {
                cordova.navigator.compass.getCurrentHeading(log('success'), log('fail'));
            }
        }, {
            name: 'Get Preferred Language (cordova-plugin-globalization)',
            fn: function() {
                cordova.navigator.globalization.getPreferredLanguage(log('success'), log('fail'));
            }
        }])
    },

    renderRow: function(plugin) {
        return (
            <TouchableHighlight style={styles.button} onPress={plugin.fn}>
              <Text>{plugin.name}</Text>
            </TouchableHighlight>
        )
    },

    render: function() {
        return (
            <View><Text style={styles.heading}></Text>
          <ListView dataSource={this.getPlugins()} renderRow={this.renderRow}/>
          <Text style={styles.status}>{this.state.status}</Text>
          <Text style={styles.result}>{this.state.result}</Text>
          </View>
        )
    },
});

var styles = {
    heading: {
        fontSize: 20,
        margin: 10,
        textAlign: 'center'
    },
    button: {
        borderWidth: 1,
        borderColor: '#ccc',
        margin: 5,
        padding: 5
    },
    status: {
        marginTop: 30,
        textAlign: 'center'
    },
    result: {
        backgroundColor: '#000000',
        color: '#FFFFFF',
        fontFamily: 'courier',
        fontSize: 16,
        fontWeight: 'bold',
        margin: 10,
        padding: 20
    }
}

 
AppRegistry.registerComponent('EasyTest', () => EasyTest);
 