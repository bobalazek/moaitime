/// <reference types="cypress" />

export function openSettingsGeneral() {
  cy.getBySel('settings--dialog--trigger-button').click();

  cy.wait(200);

  cy.getBySel(`settings--dialog--sidebar`).find('button').contains('General').click();
}

export function openCalendar() {
  cy.getBySel('calendar').should('not.exist');

  cy.getBySel('calendar--open-button').click();

  cy.getBySel('calendar').should('exist');
}

export function openCalendarHeaderSettings() {
  cy.getBySel('calendar--header--settings-button').click();

  cy.getBySel('calendar--settings--my-calendars--actions--trigger-button').click();
}

export function addNewCalendar() {
  cy.getBySel('calendar--settings--my-calendars--actions').contains('Add New Calendar').click();

  cy.getBySel('calendar--edit-dialog').find('input[id="calendar-edit-name"]').click();

  cy.wait(1000);

  cy.getBySel('calendar--edit-dialog').find('input[id="calendar-edit-name"]').type('New Calendar');
}
