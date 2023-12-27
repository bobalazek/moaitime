/// <reference types="cypress" />

import {
  addNewCalendar,
  openCalendar,
  openCalendarHeaderSettings,
  openSettingsGeneral,
} from '../../../support/utils/calendar-helpers';

describe('calendar.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should be shown by default', () => {
    cy.getBySel('calendar--open-button').should('exist');
  });

  it('should be hidden if disabled in the settings', () => {
    cy.get('[data-test="calendar--open-button"]').should('exist');

    cy.toggleSettingsSwitch('Calendar', { calendarEnabled: false });

    cy.getBySel('calendar--open-button').should('not.exist');
  });

  it('should open calendar', () => {
    openCalendar();
  });

  it('should change the start of the week', () => {
    const DAYS_OPTION = {
      name: 'Friday',
      value: '5',
    };

    openSettingsGeneral();

    cy.get('#settings-generalStartDayOfWeek').click();

    cy.getBySel('general--settings--startDayOfWeek')
      .find('div[role="option"]')
      .contains(DAYS_OPTION.name)
      .click();

    cy.clickOutside();

    cy.getBySel('calendar--open-button').click();

    cy.getBySel('calendar--monthly-view--day-of-week').first().contains('Fri.');
  });

  it('should change the timezone', () => {
    openSettingsGeneral();

    cy.getBySel('timezone-selector--trigger-button').click();

    cy.getBySel('timezone-selector--content').find('div[data-value="europe/london"]').click();

    cy.getBySel('timezone-selector--trigger-button').contains('Europe/London').should('exist');
  });

  it('should search in the timezone selector', () => {
    openSettingsGeneral();

    cy.getBySel('timezone-selector--trigger-button').click();

    cy.getBySel('timezone-selector').find('input').click().type('Africa/Abidjan{enter}');

    cy.getBySel('timezone-selector--trigger-button').contains('Africa/Abidjan').should('exist');
  });

  it('should switch to a Year in calendar dialog dropdown menu', () => {
    openCalendar();

    cy.getBySel('calendar--header--view-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('calendar--header--view-selector--dropdown-menu')
      .find('div')
      .contains('Year')
      .click();

    cy.getBySel('calendar--yearly-view').should('exist');

    cy.getBySel('calendar--header--view-selector--dropdown-menu--trigger-button')
      .contains('Year')
      .should('exist');
  });

  it('should switch from yearly view to monthly', () => {
    openCalendar();

    cy.getBySel('calendar--header--view-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('calendar--header--view-selector--dropdown-menu')
      .find('div')
      .contains('Year')
      .click();

    cy.getBySel('calendar--header--view-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('calendar--header--view-selector--dropdown-menu')
      .find('div')
      .contains('Month')
      .click();

    cy.getBySel('calendar--monthly-view').should('exist');

    cy.getBySel('calendar--header--view-selector--dropdown-menu--trigger-button')
      .contains('Month')
      .should('exist');
  });

  it('should switch to a Week in calendar dialog dropdown menu', () => {
    openCalendar();

    cy.getBySel('calendar--header--view-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('calendar--header--view-selector--dropdown-menu')
      .find('div')
      .contains('Week')
      .click();

    cy.getBySel('calendar--weekly-view').should('exist');

    cy.getBySel('calendar--header--view-selector--dropdown-menu--trigger-button')
      .contains('Week')
      .should('exist');
  });

  it('should switch to a Day in calendar dialog dropdown menu', () => {
    openCalendar();

    cy.getBySel('calendar--header--view-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('calendar--header--view-selector--dropdown-menu')
      .find('div')
      .contains('Day')
      .click();

    cy.getBySel('calendar--weekly-view').should('exist');

    cy.getBySel('calendar--header--view-selector--dropdown-menu--trigger-button')
      .contains('Day')
      .should('exist');
  });

  it('should switch to an Agenda in calendar dialog dropdown menu', () => {
    openCalendar();

    cy.getBySel('calendar--header--view-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('calendar--header--view-selector--dropdown-menu')
      .find('div')
      .contains('Agenda')
      .click();

    cy.getBySel('calendar--agenda-view').should('exist');

    cy.getBySel('calendar--header--view-selector--dropdown-menu--trigger-button')
      .contains('Agenda')
      .should('exist');
  });

  it('should close the calendar', () => {
    openCalendar();

    cy.getBySel('calendar').find('[data-test="calendar--header--home-button"]').click();

    cy.getBySel('calendar').should('not.exist');
  });

  it('should open calendar settings dialog in calendar', () => {
    openCalendar();

    cy.getBySel('calendar--header--settings-button').click();

    cy.getBySel('calendar--settings-sheet').should('exist');
  });

  it('should add a new calendar in calendar settings dialog', () => {
    openCalendar();

    openCalendarHeaderSettings();

    addNewCalendar();

    cy.getBySel('calendar--edit-dialog').find('button[type="submit"]').contains('Save').click();

    cy.getBySel('calendar--settings-sheet--calendar--name')
      .contains('New Calendar')
      .should('exist');
  });

  it('should add description to a new calendar in calendar settings dialog', () => {
    openCalendar();

    openCalendarHeaderSettings();

    addNewCalendar();

    cy.getBySel('calendar--edit-dialog')
      .find('textarea[id="calendar-edit-description"]')
      .click()
      .type('This is my New Calendar');

    cy.getBySel('calendar--edit-dialog').find('button[type="submit"]').contains('Save').click();

    cy.wait(200);

    cy.getBySel('calendar--calendar-item')
      .find('button[data-test="calendar--calendar-item--actions--dropdown-menu--trigger-button"]')
      .eq(1)
      .click();

    cy.getBySel('calendar--calendar-item--actions--dropdown-menu').contains('Edit').click();

    cy.get('#calendar-edit-description').contains('This is my New Calendar').should('exist');
  });

  it('should add color to a new calendar in calendar settings dialog', () => {
    const LIST_COLOR_OPTION = {
      name: 'Pink',
      value: '#EC4899',
    };

    openCalendar();

    openCalendarHeaderSettings();

    addNewCalendar();

    cy.getBySel('calendar--edit-dialog')
      .find('[data-test="calendar--edit-dialog--color-select--trigger-button"]')
      .click();

    cy.get('[data-test="tasks--edit-dialog--color-select"]')
      .contains(LIST_COLOR_OPTION.name)
      .click();

    cy.getBySel('calendar--edit-dialog').find('button[type="submit"]').contains('Save').click();

    cy.wait(1000);

    cy.getBySel('calendar--settings-sheet').should('exist');

    cy.getBySel('calendar--calendar-item')
      .find('button[data-test="calendar--calendar-item--actions--dropdown-menu--trigger-button"]')
      .eq(1)
      .click();

    cy.getBySel('calendar--calendar-item--actions--dropdown-menu').contains('Edit').click();

    cy.getBySel('calendar--edit-dialog--color-select--trigger-button')
      .contains('Pink')
      .should('exist');
  });

  it('should delete a new calendar in calendar settings dialog', () => {
    openCalendar();

    openCalendarHeaderSettings();

    addNewCalendar();

    cy.getBySel('calendar--edit-dialog').find('button[type="submit"]').contains('Save').click();

    cy.getBySel('calendar--settings-sheet--calendar--name')
      .contains('New Calendar')
      .should('exist');

    cy.getBySel('calendar--calendar-item')
      .find('button[data-test="calendar--calendar-item--actions--dropdown-menu--trigger-button"]')
      .eq(1)
      .click();

    cy.getBySel('calendar--calendar-item--actions--dropdown-menu').contains('Delete').click();

    cy.getBySel('calendar--settings-sheet').contains('New Calendar').should('not.exist');
  });

  it('should show deleted calendar in calendar settings dialog', () => {
    openCalendar();

    openCalendarHeaderSettings();

    addNewCalendar();

    cy.getBySel('calendar--edit-dialog').find('button[type="submit"]').contains('Save').click();

    cy.getBySel('calendar--settings-sheet--calendar--name')
      .contains('New Calendar')
      .should('exist');

    cy.getBySel('calendar--calendar-item')
      .find('button[data-test="calendar--calendar-item--actions--dropdown-menu--trigger-button"]')
      .eq(1)
      .click();

    cy.getBySel('calendar--calendar-item--actions--dropdown-menu').contains('Delete').click();

    cy.getBySel('calendar--settings-sheet').contains('New Calendar').should('not.exist');

    cy.getBySel('calendar--settings--my-calendars--actions--trigger-button').click();

    cy.getBySel('calendar--settings--my-calendars--actions')
      .contains('Show Deleted Calendars')
      .click();

    cy.getBySel('calendar--deleted-calendars-dialog').contains('New Calendar').should('exist');
  });

  it('should undelete deleted calendar in Deleted Calendars', () => {
    openCalendar();

    openCalendarHeaderSettings();

    addNewCalendar();

    cy.getBySel('calendar--edit-dialog').find('button[type="submit"]').contains('Save').click();

    cy.getBySel('calendar--settings-sheet--calendar--name')
      .contains('New Calendar')
      .should('exist');

    cy.getBySel('calendar--calendar-item')
      .find('button[data-test="calendar--calendar-item--actions--dropdown-menu--trigger-button"]')
      .eq(1)
      .click();

    cy.getBySel('calendar--calendar-item--actions--dropdown-menu').contains('Delete').click();

    cy.getBySel('calendar--settings-sheet').contains('New Calendar').should('not.exist');

    cy.getBySel('calendar--settings--my-calendars--actions--trigger-button').click();

    cy.getBySel('calendar--settings--my-calendars--actions')
      .contains('Show Deleted Calendars')
      .click();

    cy.getBySel('calendar--deleted-calendars-dialog')
      .find('div[data-test="calendar--calendar-item"]')
      .find('button[data-test="calendar--calendar-item--actions--dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('calendar--calendar-item--actions--dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('Undelete')
      .click({ force: true });

    cy.getBySel('calendar--deleted-calendars-dialog').find('[data-test="dialog--close"]').click();

    cy.getBySel('calendar--settings-sheet')
      .find('div[data-test="calendar--calendar-item"]')
      .contains('New Calendar')
      .should('exist');
  });
});
