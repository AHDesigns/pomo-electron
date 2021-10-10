import React, { FC, useState } from 'react';
import { useConfig, useBridge } from '@client/contexts';
import styled, { useTheme } from 'styled-components';
import { Setting } from './Setting';
import { Form, InputPassword, Label } from './Form';

interface IButton {
  variant?: 'secondary' | 'tertiary';
}

const Button = styled.button<IButton>``;

export const Slack: FC = () => {
  const {
    config: { slack },
    storeUpdate,
  } = useConfig();
  const theme = useTheme();
  const bridge = useBridge();

  const initialToken = slack.enabled ? slack.slackToken : '';
  const initialCookie = slack.enabled ? slack.slackDCookie : '';
  const initialSCookie = slack.enabled ? slack.slackDSCookie : '';

  const [token, setToken] = useState(initialToken);
  const [cookie, setCookie] = useState(initialCookie);
  const [sCookie, setSCookie] = useState(initialSCookie);

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
    >
      {slack.enabled && (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            storeUpdate({
              slack: {
                slackToken: token,
                slackDCookie: cookie,
                slackDSCookie: sCookie,
              },
            });
          }}
        >
          <Label htmlFor="slackToken">Token</Label>
          <InputPassword
            name="slackToken"
            id="slackToken"
            placeholder="xocx-..."
            value={token}
            onChange={({ target }) => {
              setToken(target.value);
            }}
          />
          <Label htmlFor="slackCookie">Cookie "d"</Label>
          <InputPassword
            name="slackCookie"
            id="slackCookie"
            placeholder="xocx-..."
            value={cookie}
            onChange={({ target }) => {
              setCookie(target.value);
            }}
          />
          <Label htmlFor="slackCookieD">Cookie "ds"</Label>
          <InputPassword
            name="slackCookieD"
            id="slackCookieD"
            placeholder="xocx-..."
            value={sCookie}
            onChange={({ target }) => {
              setSCookie(target.value);
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
          <div
            style={{
              gridColumn: 'left / right',
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <div style={{ marginRight: `${theme.spacing.normal}px` }}>
              <Button disabled={canSubmit} type="submit">
                Submit
              </Button>
            </div>
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
        </Form>
      )}
    </Setting>
  );
};
