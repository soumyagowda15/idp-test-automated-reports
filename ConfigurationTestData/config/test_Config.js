module.exports = {
    BASE_URL:{
        prod:"https://dev-idp.neutrinos.co",
        dev:"url", //to-do
        test:"url"
    },
    URL_ACCESS_TOKEN: "https://ids.neutrinos.co/token",
    SUB_URL_CREATE_JOB: "/api/job",
    SUB_URL_UPLOAD_DOCUMENT: "/api/job/documents/upload",
    URL_START_DOC_ANALYSIS: "/api/job/start-doc-analysis",
    SUB_URL_GET_JOBS : "/api/jobs/list",
    auth: {
        "client_id": " ",
        "client_secret": " ",
        "grant_type": " "
    },
    SUB_URL: "/api/job/start-doc-analysis",
    INVALID_JOB_ID: "63bbcde63c1032bf44b4",
    INVALID_FILE_ID: "63bbce1b3c141d0032bf448",
    GRANT_TYPE: "client_credentials",
    authorization:
    {
        prod:{
            CLIENT_SECRET: "n-69mmPydqxGRXjxmlLwi_wRIYHHY-2WRY2wFUmLKcQUjy19KsJ1KN35akFUl_d8uyXEeb6MmJohNEmgEwf3HQ",
            CLIENT_ID: "x4PNAVz-EzNX48LFqnOsP",
            CLIENT_ID1: "JT8c6UjKar_LfvYr4dcfP",
            CLIENT_SECRET1: "nyZwKpIODGYbayAv4QKTnWJInmTeI8CZiTSfGwU1DFFsBiYLM2Y8p6EmHYCk0sZ_4Pk-6Z9FOfiKPtaiWK81qA",
            UNREGISTERED_CLIENT_ID: "lm_tyhzQfl-blKHKlZS6O",
            UNREGISTERED_CLIENT_SECRET: "3JB9BeUFMzk_iBllTL5ra4eoA0GQYBDfon8sj2CaEC5ew4LgJTaKvo_KcKKhVJaw1V06m1havXXBIB_2xmxYfQ",
            JOB_ID_DOCUMENT_NOT_UPLOADED: "63e3a0b252e7f50019ed7253",
            EXPIRED_ACCESS_TOKEN: "XZID-4oErmMFGGjKWK0UgAHVXDUfY5KzQnUwfagzWO-",
            VALID_FILE_ID:"63f2263f3a20910019149195",
            JOB_ID_DOCUMENT_UPLOADED:"63f703ced4e3050019bb935f"
        }
    },
    NEUTRINOS_TENANT_ID: '6225cde095f5119c54aa1234',
    
    TENANT: "neutrinos",
    MONGO_DB_ENVIRONMENTS: {

        dev:{
            MONGODB_URI: 'mongodb+srv://idp-dev-user:suJdbIX23mCkcs2c@idp-dev-sandbox.snnpi.mongodb.net/idp-dev?retryWrites=true&w=majority',
            MONGODB_DATABASE_NAME: 'idp-dev'
        },
        prod:{
            MONGODB_URI : 'mongodb+srv://idp-dev-user:suJdbIX23mCkcs2c@idp-dev-sandbox.snnpi.mongodb.net/idp?retryWrites=true&w=majority',
            MONGODB_DATABASE_NAME: 'idp'
        },
        test:{
            MONGO_URI : 'mongodb+srv://idp-dev-user:suJdbIX23mCkcs2c@idp-dev-sandbox.snnpi.mongodb.net/idp-dev?retryWrites=true&w=majority',
            MONGODB_DATABASE_NAME: 'idp-dev'
        }
        
    },
    environment:"prod"
}