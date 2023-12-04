/// <reference types="cypress" />

describe('calendar.cy.ts', () => {
  before(() => {
    cy.reloadDatabase();
  });

  beforeEach(() => {
    cy.login();
  });

  it('should be shown by default', () => {
    cy.getBySel('calendar--dialog--trigger-button').should('exist');
  });

  it('should be hidden if disabled in the settings', () => {
    cy.get('[data-test="calendar--dialog--trigger-button"]').should('exist');

    cy.toggleSettingsSwitch('Calendar', { calendarEnabled: false });

    cy.getBySel('calendar--dialog--trigger-button').should('not.exist');
  });

  it('should open calendar', () => {
    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--dialog').should('exist');
  });

  it('should change the start of the week', () => {
    const DAYS_OPTION = {
      name: 'Friday',
      value: '5',
    };

    cy.getBySel('settings--dialog--trigger-button').click();

    cy.wait(200);

    cy.getBySel(`settings--dialog--sidebar`).find('button').contains('Calendar').click();

    cy.get('#settings-calendarStartDayOfWeek').click();

    cy.getBySel('calendar--settings--startDayOfWeek')
      .find('div[role="option"]')
      .contains(DAYS_OPTION.name)
      .click();

    cy.clickOutside();

    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--monthly-view--day-of-week').first().contains('Fri.');
  });

  it('should switch to a Year in calendar dialog dropdown menu', () => {
    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu')
      .find('div')
      .contains('Year')
      .click();

    cy.getBySel('calendar--yearly-view').should('exist');

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu--trigger-button')
      .contains('Year')
      .should('exist');
  });

  it('should switch from yearly view to monthly', () => {
    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu')
      .find('div')
      .contains('Year')
      .click();

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu')
      .find('div')
      .contains('Month')
      .click();

    cy.getBySel('calendar--monthly-view').should('exist');

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu--trigger-button')
      .contains('Month')
      .should('exist');
  });

  it('should switch to a Week in calendar dialog dropdown menu', () => {
    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu')
      .find('div')
      .contains('Week')
      .click();

    cy.getBySel('calendar--weekly-view').should('exist');

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu--trigger-button')
      .contains('Week')
      .should('exist');
  });

  it('should switch to a Day in calendar dialog dropdown menu', () => {
    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu')
      .find('div')
      .contains('Day')
      .click();

    cy.getBySel('calendar--weekly-view').should('exist');

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu--trigger-button')
      .contains('Day')
      .should('exist');
  });

  it('should close the calendar', () => {
    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--dialog').find('[data-test="dialog--close"]').click();

    cy.getBySel('calendar--dialog').should('not.exist');
  });

  it.skip('should switch to next month in calendar Month view', () => {
    cy.get('[data-test="calendar--dialog--trigger-button"]').click();

    cy.get(
      '[data-test="calendar--dialog--header--view-selector--dropdown-menu--trigger-button"]'
    ).click();

    cy.get('[data-test="calendar--dialog--header--view-selector--dropdown-menu"] div')
      .contains('Month')
      .click();
  });
});
