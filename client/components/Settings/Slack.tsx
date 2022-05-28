import React, { useState } from 'react';
import { useBridge, useConfig } from '@client/hooks';
import { Button } from '@client/components';
import { FormItemPassword } from '@client/components/Form/FormItem';
import { Setting } from './Setting';

export function Slack(): JSX.Element | null {
  const config = useConfig();
  const { storeUpdate } = config;
  const bridge = useBridge();

  // TODO: fix this up to handle loading
  const slack = config.config?.slack ?? { enabled: false };

  const initialToken = slack.enabled ? slack.slackToken : '';
  const initialCookie = slack.enabled ? slack.slackDCookie : '';
  const initialSCookie = slack.enabled ? slack.slackDSCookie : '';

  const [token, setToken] = useState(initialToken);
  const [cookie, setCookie] = useState(initialCookie);
  const [sCookie, setSCookie] = useState(initialSCookie);

  // TODO: upgrade Typescript to get this to work as just loading
  if (config.loading) return null;

  const canSubmit =
    [token, cookie].includes('') ||
    (token === initialToken && cookie === initialCookie && sCookie === initialSCookie);

  return (
    <Setting
      heading="Slack"
      variant="toggle"
      checked={slack.enabled}
      onToggle={() => {
        storeUpdate({
          slack: {
            enabled: !slack.enabled,
          },
        });
      }}
      onSubmit={() => {
        storeUpdate({
          slack: {
            slackToken: token,
            slackDCookie: cookie,
            slackDSCookie: sCookie,
          },
        });
      }}
    >
      <FormItemPassword
        id="slackToken"
        label="Token"
        input={{
          placeholder: 'xocx-...',
          value: token,
          onChange: (v) => setToken(v),
        }}
      />
      <FormItemPassword
        id="slackCookie"
        label="Cookie 'd'"
        input={{
          placeholder: 'xocx-...',
          value: cookie,
          onChange: (v) => setCookie(v),
        }}
      />
      <FormItemPassword
        id="slackCookieD"
        label="Cookie 'ds'"
        input={{
          placeholder: 'xocx-...',
          value: sCookie,
          onChange: (v) => setSCookie(v),
        }}
      />

      <div
        style={{
          gridColumn: 'left / right',
          textAlign: 'center',
        }}
      >
        <Button
          type="button"
          variant="tertiary"
          onClick={() => {
            bridge.openExternal('https://github.com/AHDesigns/pomo-electron#slack-integration');
          }}
        >
          where do I get these from?
        </Button>
      </div>
      <div className="flex justify-between">
        <Button disabled={canSubmit} type="submit">
          Submit
        </Button>
        <Button
          disabled={[token, cookie].includes('')}
          type="button"
          variant="secondary"
          onClick={() => {
            setToken(initialToken);
            setCookie(initialCookie);
            setSCookie(initialSCookie);
          }}
        >
          Cancel
        </Button>
      </div>
    </Setting>
  );
}
