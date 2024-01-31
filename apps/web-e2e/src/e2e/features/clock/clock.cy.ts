/// <reference types="cypress" />

describe('clock.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should exist and show seconds and be in 24-hours format', () => {
    cy.getBySel('clock').should('exist');

    const regex = new RegExp(/\d{2}:\d{2}:\d{2}/);
    cy.getBySel('clock').contains(regex);
  });

  it('should not be visible if we disable it in the settings', () => {
    cy.getBySel('clock').should('exist');

    cy.toggleSettingsSwitch('Widgets', { clockEnabled: false });

    cy.getBySel('clock').should('not.exist');
  });

  it('should hide the seconds if we disable them in the settings', () => {
    cy.toggleSettingsSwitch('Widgets', { clockShowSeconds: false });

    const regex = new RegExp(/\d{1,2}:\d{2}/);
    cy.getBySel('clock').contains(regex);
  });

  it('should show the AM/PM format if we disable the 24-hour format in the settings', () => {
    cy.getBySel('settings--dialog--trigger-button').click();

    cy.toggleSettingsSwitch('Widgets', { clockUse24HourClock: false });

    const regex = new RegExp(/\d{1,2}:\d{2}:\d{2} (AM|PM)/);
    cy.getBySel('clock').contains(regex);
  });

  it('should show the AM/PM format without seconds if we disable the 24-hour format and seconds in the settings', () => {
    cy.getBySel('settings--dialog--trigger-button').click();

    // If setting multiple settings consequentially, we need to wait for the previous one to finish,
    cy.toggleSettingsSwitch('Widgets', { clockUse24HourClock: false, clockShowSeconds: false });

    const regex = new RegExp(/\d{1,2}:\d{2} (AM|PM)/);
    cy.getBySel('clock').contains(regex);
  });

  it('should switch to a analog clock', () => {
    cy.getBySel('settings--dialog--trigger-button').click();

    cy.toggleSettingsSwitch('Widgets', { clockUseDigitalClock: false });

    cy.getBySel('clock--analog-clock').should('exist');
  });
});
