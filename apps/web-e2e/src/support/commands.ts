/// <reference types="cypress" />

import { UserSettings } from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable {
      /**
       * Reloads the database
       */
      reloadDatabase(): Chainable;

      /**
       * Gets the newest email
       */
      getNewestEmail(): Chainable;

      /**
       * Logs in with the given credentials
       */
      login(email?: string, password?: string): Chainable;

      /**
       * @param sectionLabel What label to click on, for example "Weather"
       * @param setting Name of the setting, excluding the "#settings-" part, for example "weatherEnabled" will translate to "#settings-weatherEnabled"
       * @param state The state of the switch. Ommit argument if you want to toggle, true for checked, false for unchecked
       */
      toggleSettingsSwitch(
        sectionLabel: string,
        settings: Partial<Record<keyof UserSettings, boolean | undefined>>
      ): Chainable;

      /**
       * Clicks outside the element
       */
      clickOutside(): Chainable;

      /**
       * Gets an element by selector
       */
      getBySel(selector: string): Chainable;

      /**
       * Gets an element by selector that contains a string
       */
      getBySelLike(selector: string): Chainable;

      /**
       * Gets the toasts container
       */
      getToastsContainer(): Chainable;

      /**
       * Checks if we have a toast with the provided text
       */
      hasToastWithText(text: string): Chainable;
    }
  }
}

Cypress.Commands.add('reloadDatabase', () => {
  return cy.request({
    method: 'POST',
    url: `${API_URL}/api/testing/reload-database`,
  });
});

Cypress.Commands.add('getNewestEmail', () => {
  return cy.request({
    method: 'GET',
    url: `${API_URL}/api/testing/emails/newest`,
  });
});

Cypress.Commands.add('login', (email, password) => {
  const defaultUser = Cypress.env('users').default;
  email = email || defaultUser.email;
  password = password || defaultUser.password;

  Cypress.LocalStorage.clear();
  Cypress.session.clearAllSavedSessions();

  cy.visit('/login');

  cy.get('#login-email').type(email as string);
  cy.get('#login-password').type(password as string);
  cy.get('#login-button').click();
});

Cypress.Commands.add('toggleSettingsSwitch', (sectionLabel, settings) => {
  // Open settings if not already open
  cy.get('body').then(($body) => {
    if ($body.find('[data-test="settings--dialog"]').length === 0) {
      cy.getBySel('settings--dialog--trigger-button').click();
      cy.getBySel('settings--dialog').should('be.visible');
    }
  });

  // Open the section
  cy.getBySel(`settings--dialog--sidebar`).find('button').contains(sectionLabel).click();

  Object.keys(settings).forEach((setting) => {
    const state = settings[setting as keyof UserSettings];
    const switchSelector = `#settings-${setting}`;

    cy.get(switchSelector).then(($switch) => {
      const currentState = $switch.attr('data-state') === 'checked';
      if (state === undefined || currentState !== state) {
        cy.wrap($switch).click();

        if (state !== undefined) {
          cy.wrap($switch).should('have.attr', 'data-state', state ? 'checked' : 'unchecked');
        }
      }
    });
  });

  // Close settings
  cy.clickOutside();
});

Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click({
    force: true,
  });
});

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args);
});

Cypress.Commands.add('getToastsContainer', () => {
  return cy.get('[data-sonner-toaster="true"]');
});

Cypress.Commands.add('hasToastWithText', (text) => {
  return cy.getToastsContainer().find('div[data-content]').contains(text);
});
