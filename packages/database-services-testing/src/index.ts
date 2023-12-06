// Basically the only reason this is a separate package is because of a circular dependency issue.
// We could not really put that simply into the database-services package,
// as that already depends on the emails-mailer package

export * from './TestingEmailsManager';
