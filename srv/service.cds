using {db} from '../db/datamodel';

service CatalogService @(path: 'CatalogService') {
    entity schemas as projection on db.schemas;

    entity Products {
        key ProductID: String(5);
            ProductName: String(100);
    }
    entity jobs {
       key clientId : String(10);
    }
}
