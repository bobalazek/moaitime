/// <reference types="cypress" />

describe('calendar.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

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

    cy.getBySel(`settings--dialog--sidebar`).find('button').contains('General').click();

    cy.get('#settings-generalStartDayOfWeek').click();

    cy.getBySel('general--settings--startDayOfWeek')
      .find('div[role="option"]')
      .contains(DAYS_OPTION.name)
      .click();

    cy.clickOutside();

    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--monthly-view--day-of-week').first().contains('Fri.');
  });

  it('should change the timezone', () => {
    cy.getBySel('settings--dialog--trigger-button').click();

    cy.wait(200);

    cy.getBySel(`settings--dialog--sidebar`).find('button').contains('General').click();

    cy.getBySel('timezone-selector--trigger-button').click();

    cy.getBySel('timezone-selector--content').find('div[data-value="europe/london"]').click();

    cy.getBySel('timezone-selector--trigger-button').contains('Europe/London').should('exist');
  });

  it('should search in the timezone selector', () => {
    cy.getBySel('settings--dialog--trigger-button').click();

    cy.wait(200);

    cy.getBySel(`settings--dialog--sidebar`).find('button').contains('General').click();

    cy.getBySel('timezone-selector--trigger-button').click();

    cy.getBySel('timezone-selector').find('input').click().type('Africa/Abidjan{enter}');

    cy.getBySel('timezone-selector--trigger-button').contains('Africa/Abidjan').should('exist');
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

  it('should switch to an Agenda in calendar dialog dropdown menu', () => {
    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu')
      .find('div')
      .contains('Agenda')
      .click();

    cy.getBySel('calendar--agenda-view').should('exist');

    cy.getBySel('calendar--dialog--header--view-selector--dropdown-menu--trigger-button')
      .contains('Agenda')
      .should('exist');
  });

  it('should close the calendar', () => {
    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--dialog')
      .find('[data-test="calendar--dialog--header--home-button"]')
      .click();

    cy.getBySel('calendar--dialog').should('not.exist');
  });

  it('should calendar settings dialog in calendar', () => {
    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--dialog--header--settings-button').click();

    cy.getBySel('calendar--settings-sheet').should('exist');
  });

  it('should add a new calendar in calendar settings dialog', () => {
    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--dialog--header--settings-button').click();

    cy.getBySel('calendar--settings--my-calendars--actions--trigger-button').click();

    cy.getBySel('calendar--settings--my-calendars--actions').contains('Add New Calendar').click();

    cy.getBySel('calendar--edit-dialog').find('input[id="calendar-edit-name"]').click();

    cy.wait(1000);

    cy.getBySel('calendar--edit-dialog')
      .find('input[id="calendar-edit-name"]')
      .type('New Calendar');

    cy.getBySel('calendar--edit-dialog').find('button[type="submit"]').contains('Save').click();

    cy.getBySel('calendar--settings-sheet--calendar--name')
      .contains('New Calendar')
      .should('exist');
  });

  it('should add description to a new calendar in calendar settings dialog', () => {
    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--dialog--header--settings-button').click();

    cy.getBySel('calendar--settings--my-calendars--actions--trigger-button').click();

    cy.getBySel('calendar--settings--my-calendars--actions').contains('Add New Calendar').click();

    cy.getBySel('calendar--edit-dialog').find('input[id="calendar-edit-name"]').click();

    cy.wait(1000);

    cy.getBySel('calendar--edit-dialog')
      .find('input[id="calendar-edit-name"]')
      .type('New Calendar');

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

    cy.getBySel('calendar--dialog--trigger-button').click();

    cy.getBySel('calendar--dialog--header--settings-button').click();

    cy.getBySel('calendar--settings--my-calendars--actions--trigger-button').click();

    cy.getBySel('calendar--settings--my-calendars--actions').contains('Add New Calendar').click();

    cy.getBySel('calendar--edit-dialog').find('input[id="calendar-edit-name"]').click();

    cy.wait(1000);

    cy.getBySel('calendar--edit-dialog')
      .find('input[id="calendar-edit-name"]')
      .type('New Calendar');

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
});
