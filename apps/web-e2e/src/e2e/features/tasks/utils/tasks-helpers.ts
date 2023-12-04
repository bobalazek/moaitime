export function openTasksPopover() {
  cy.get('[data-test="tasks--popover"]').should('not.exist');

  cy.get('[data-test="tasks--popover--trigger-button"]').click();

  cy.get('[data-test="tasks--popover"]').should('exist');
}

export function openTasksFirstListActions() {
  cy.get('[data-test="tasks--body-header--lists-list--dropdown-menu--trigger-button"]').click();

  cy.get('[data-test="tasks--list-actions--dropdown-menu--trigger-button"]').first().click();
}

export function openTasksNewListDropdownMenu() {
  cy.get('[data-test="tasks--body-header--lists-list--dropdown-menu--trigger-button"]').click();

  cy.get('[data-test="tasks--selected-list--dropdown-menu--add-new-button"]').click();
}

export function addMultipleTasks() {
  cy.getBySel('tasks--tasks-form').type('ccc{enter}');

  cy.getBySel('tasks--tasks-form').type('aaa{enter}');

  cy.getBySel('tasks--tasks-form').type('ddd{enter}');

  cy.getBySel('tasks--tasks-form').type('bbb{enter}');
}
