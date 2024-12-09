context db {
  entity schemas {
    key name                    : String(20);
        schemaDescription       : String(20);
        documentType            : String(20);
        documentTypeDescription : String(20);
        id                      : UUID;
        predefined              : Boolean;
        version                 : String(5);
  }
}
