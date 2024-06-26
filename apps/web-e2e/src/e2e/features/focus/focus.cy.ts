/// <reference types="cypress" />

describe('focus.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should be shown by default', () => {
    cy.getBySel('focus--open-button').should('exist');
  });

  it('should be hidden if disabled in the settings', () => {
    cy.getBySel('focus--open-button').should('exist');

    cy.toggleSettingsSwitch('Focus', { focusEnabled: false });

    cy.getBySel('focus--open-button').should('not.exist');
  });

  it.skip('should change default session settings in settings and show them in focus', () => {
    cy.getBySel('settings--dialog--trigger-button').click();

    cy.getBySel('settings--dialog--sidebar').contains('Focus').click();

    cy.get('input[id="settings-focusSessionSettings-focusDurationSeconds"]')
      .click()
      .clear()
      .type('45');
  });

  it('should open focus', () => {
    cy.getBySel('focus--open-button').click();

    cy.getBySel('focus').should('exist');
  });

  it('should close focus', () => {
    cy.getBySel('focus--open-button').click();

    cy.getBySel('focus').find('[data-test="focus--header--home-button"]').click();

    cy.getBySel('focus').should('not.exist');
  });

  it('should add a nonexisting task in focus and start', () => {
    cy.getBySel('focus--open-button').click();

    cy.get('input[placeholder="Search tasks ..."]').type('Task1');

    cy.get('button').contains("Let's go!").click();

    cy.getBySel('focus--main').contains('Focus');
  });

  it('should display task name in focus', () => {
    cy.getBySel('focus--open-button').click();

    cy.get('input[placeholder="Search tasks ..."]').type('Task1');

    cy.get('button').contains("Let's go!").click();

    cy.getBySel('focus--main').contains('Task1');
  });

  it('should add existing task in focus and start', () => {
    cy.getBySel('tasks--popover--trigger-button').click();

    cy.getBySel('tasks--tasks-form').find('input').type('My focus task{enter}');

    cy.clickOutside();

    cy.getBySel('focus--open-button').click();

    cy.get('input[placeholder="Search tasks ..."]').type('My');

    cy.getBySel('task-autocomplete').first().click();

    cy.get('button').contains("Let's go!").click();

    cy.getBySel('focus--main').contains('My focus task');
  });

  it('should end focus when clicked completed', () => {
    cy.getBySel('focus--open-button').click();

    cy.get('input[placeholder="Search tasks ..."]').type('Task1');

    cy.get('button').contains("Let's go!").click();

    cy.getBySel('focus--main').contains('Focus');

    cy.get('button').contains('Complete').click();

    cy.getBySel('focus--main').contains('Focus').should('not.exist');
  });

  it('should skip focus and go to short break when clicked skip', () => {
    cy.getBySel('focus--open-button').click();

    cy.get('input[placeholder="Search tasks ..."]').type('Task1');

    cy.get('button').contains("Let's go!").click();

    cy.getBySel('focus--main').contains('Focus');

    cy.get('button').contains('Skip').click();

    cy.getBySel('focus--main').contains('Short Break');
  });
});
