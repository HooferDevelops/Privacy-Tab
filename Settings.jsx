const { React } = require('powercord/webpack')
const { SwitchItem, TextInput, SliderInput, KeybindRecorder } = require('powercord/components/settings')
const { Divider } = require('powercord/components')

module.exports = class Settings extends React.PureComponent {
    constructor (props) {
        super(props);
        this.plugin = powercord.pluginManager.get('Privacy-Tab') || powercord.pluginManager.get('Privacy-Tab-master');
      }


    render() {
        return ( 
        <div>
        <KeybindRecorder
            value={this.props.getSetting('toggle-keybind-value')}
            defaultValue={'Ctrl+Shift+P'}
            initialValue={this.props.getSetting('toggle-keybind-value', 'Ctrl+Shift+P')}
            onChange={val => { 
                if (!this.props.getSetting('toggle-keybind-value')){
                    this.props.setSetting('toggle-keybind-value', "Ctrl+Shift+P")
                }
                this.plugin.updateKeybinds(this.props.getSetting('toggle-keybind-value'), val);
                this.props.updateSetting('toggle-keybind-value', val); 
            }}
            onReset={()=>{
                if (!this.props.getSetting('toggle-keybind-value')){
                    this.props.setSetting('toggle-keybind-value', "Ctrl+Shift+P")
                }
                this.plugin.updateKeybinds(this.props.getSetting('toggle-keybind-value'), 'Ctrl+Shift+P');
                this.props.updateSetting('toggle-keybind-value', 'Ctrl+Shift+P');
            }}
        >
            Toggle Keybind
        </KeybindRecorder>
        <SwitchItem
            value={ this.props.getSetting('global-keybind') }
            onChange={ () => {
                this.props.toggleSetting('global-keybind')
            }}
            note='If enabled, it will listen for keybinds outside of Discord.'
        >
            Global Keybind
        </SwitchItem>
        <br></br>
        <SliderInput
               minValue={0.5}
               maxValue={10}
               stickToMarkers
               markers={[0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
               defaultValue={1}
               initialValue={this.props.getSetting('blur-scale', 1)}
               onValueChange={val => this.props.updateSetting('blur-scale', val)}
               note='Scale of the blur amount.'
               onMarkerRender={v => `x${v}`}
        >
            Blur Scale
        </SliderInput>
        <SwitchItem
            value={ this.props.getSetting('grayscale') }
            onChange={ () => {
                this.props.toggleSetting('grayscale')
            }}
        >
            Grayscale Enabled
        </SwitchItem>
        <a
        style={{fontSize: "10px"}}
        onClick={()=> {
            require("electron").shell.openExternal("http://iman.engineer");
        }}
        >More Plugins & Themes</a>
        </div>
        );
    }
}
