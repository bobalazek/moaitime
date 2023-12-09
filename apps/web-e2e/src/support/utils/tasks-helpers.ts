export function openTasksPopover() {
  cy.getBySel('tasks--popover').should('not.exist');

  cy.getBySel('tasks--popover--trigger-button').click();

  cy.getBySel('tasks--popover').should('exist');
}

export function openTasksFirstListActions() {
  cy.getBySel('tasks--body-header--lists-list--dropdown-menu--trigger-button').click();

  cy.getBySel('tasks--list-actions--dropdown-menu--trigger-button').first().click();

  cy.getBySel('tasks--list-actions--dropdown-menu').should('exist');
}

export function openTasksNewListDropdownMenu() {
  cy.getBySel('tasks--body-header--lists-list--dropdown-menu--trigger-button').click();

  cy.getBySel('tasks--selected-list--dropdown-menu--add-new-button').click();
}

export function addMultipleTasks() {
  // ccc
  cy.intercept('POST', '/api/v1/tasks').as('tasks-ccc');

  cy.getBySel('tasks--tasks-form').find('input').type('ccc{enter}');

  cy.wait('@tasks-ccc');

  // aaa
  cy.intercept('POST', '/api/v1/tasks').as('tasks-aaa');

  cy.getBySel('tasks--tasks-form').find('input').type('aaa{enter}');

  cy.wait('@tasks-ccc');

  // ddd
  cy.intercept('POST', '/api/v1/tasks').as('tasks-ddd');

  cy.getBySel('tasks--tasks-form').find('input').type('ddd{enter}');

  cy.wait('@tasks-ddd');

  // bbb
  cy.intercept('POST', '/api/v1/tasks').as('tasks-bbb');

  cy.getBySel('tasks--tasks-form').find('input').type('bbb{enter}');

  cy.wait('@tasks-bbb');
}
