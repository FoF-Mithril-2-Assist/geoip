import Alert from 'flarum/components/Alert';
import SettingsModal from 'flarum/components/SettingsModal';
import humanTime from 'flarum/helpers/humanTime';
import extractText from 'flarum/utils/extractText';
import linkify from 'linkify-lite';
import { settings } from '@fof-components';

const {
    items: { BooleanItem, SelectItem, StringItem },
} = settings;

export default class GeoipSettingsModal extends SettingsModal {
    className() {
        return 'Modal--medium';
    }

    title() {
        return app.translator.trans('fof-geoip.admin.settings.title');
    }

    form() {
        const service = this.setting('fof-geoip.service')();
        const errorTime = Number(app.data.settings[`fof-geoip.services.${service}.last_error_time`]) * 1000;
        let error = app.data.settings[`fof-geoip.services.${service}.error`];

        if (error) error = linkify(error);

        return [
            <div className="Form-group">
                <label>{app.translator.trans('fof-geoip.admin.settings.service_label')}</label>

                {SelectItem.component({
                    options: app.data['fof-geoip.services'].reduce((o, p) => {
                        o[p] = app.translator.trans(`fof-geoip.admin.settings.service_${p}_label`);

                        return o;
                    }, {}),
                    name: 'fof-geoip.service',
                    setting: this.setting.bind(this),
                    required: true,
                })}

                <br />
                <br />
                <p className="helpText">
                    {service && m.trust(linkify(extractText(app.translator.trans(`fof-geoip.admin.settings.service_${service}_description`))))}
                </p>
            </div>,

            error
                ? Alert.component({
                    className: 'Form-group',
                    dismissible: false,
                }, [<b style={{ textTransform: 'uppercase', marginRight: '5px' }}>{humanTime(errorTime)}</b>, m.trust(error)])
                : '',

            ['ipdata', 'ipstack'].includes(service)
                ? [
                    <StringItem name={`fof-geoip.services.${service}.access_key`} setting={this.setting.bind(this)} required>
                        {app.translator.trans('fof-geoip.admin.settings.access_key_label')}
                    </StringItem>,
                ]
                : [],

            service === 'ipstack' ? (
                <div className="Form-group">
                    <BooleanItem name={`fof-geoip.services.ipstack.security`} setting={this.setting.bind(this)}>
                        {app.translator.trans('fof-geoip.admin.settings.security_label')}
                    </BooleanItem>
                </div>
            ) : (
                    []
                ),
        ];
    }
}
