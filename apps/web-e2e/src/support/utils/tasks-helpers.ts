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

  cy.getBySel('tasks--lists-list--header--dropdown-menu--trigger-button').click();

  cy.getBySel('tasks--lists-list--header--dropdown-menu--add-new-button').click();
}

export function addMultipleTasks() {
  const addAndWaitForTask = (taskName: string) => {
    const aliasName = `createTask-${taskName}`;

    cy.intercept('POST', '/api/v1/tasks').as(aliasName);

    cy.getBySel('tasks--tasks-form').find('input').type(`${taskName}{enter}`);

    cy.wait(`@${aliasName}`);

    cy.getBySel('tasks--tasks-list')
      .find('[data-test="tasks--task"]')
      .last()
      .find('[data-test="tasks--task--name"]')
      .should('have.text', taskName);
  };

  addAndWaitForTask('ccc');
  addAndWaitForTask('aaa');
  addAndWaitForTask('ddd');
  addAndWaitForTask('bbb');
}

export function addPriorityToMultipleTasks() {
  const LIST_COLOR_OPTION = {
    name1: 'High',
    value1: '#EF4444',
    name2: 'Medium',
    value2: '#F59E0B',
    name3: 'Low',
    value3: '#3B82F6',
  };
  const addAndWaitForTask = (taskName: string) => {
    const aliasName = `createTask-${taskName}`;

    cy.intercept('POST', '/api/v1/tasks').as(aliasName);

    cy.getBySel('tasks--tasks-form').find('input').type(`${taskName}{enter}`);

    cy.wait(`@${aliasName}`);

    cy.getBySel('tasks--tasks-list')
      .find('[data-test="tasks--task"]')
      .last()
      .find('[data-test="tasks--task--name"]')
      .should('have.text', taskName);
  };

  addAndWaitForTask('ccc');
  addAndWaitForTask('aaa');
  addAndWaitForTask('ddd');
  addAndWaitForTask('bbb');

  cy.getBySel('tasks--task').contains('aaa').click();

  cy.getBySel('tasks--task-edit-dialog--priority-select--trigger-button').click();

  cy.getBySel('tasks--task-edit-dialog--priority-select')
    .find('div[role="option"]')
    .contains(LIST_COLOR_OPTION.name1)
    .click();

  cy.getBySel('tasks--task-edit-dialog').get('button').contains('Save').click();

  cy.getBySel('tasks--task').contains('ddd').click();

  cy.getBySel('tasks--task-edit-dialog--priority-select--trigger-button').click();

  cy.getBySel('tasks--task-edit-dialog--priority-select')
    .find('div[role="option"]')
    .contains(LIST_COLOR_OPTION.name2)
    .click();

  cy.getBySel('tasks--task-edit-dialog').get('button').contains('Save').click();

  cy.getBySel('tasks--task').contains('bbb').click();

  cy.getBySel('tasks--task-edit-dialog--priority-select--trigger-button').click();

  cy.getBySel('tasks--task-edit-dialog--priority-select')
    .find('div[role="option"]')
    .contains(LIST_COLOR_OPTION.name3)
    .click();

  cy.getBySel('tasks--task-edit-dialog').get('button').contains('Save').click();
}
