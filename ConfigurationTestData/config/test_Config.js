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
    NEUTRINOS_TENANT_ID: '6225cde095f5119c54aa1234',
    TENANT: "neutrinos",
    MAIL_TO:"idp-team@neutrinos.co",
    MAIL_FROM:"soumya.gowda@neutrinos.co",
    MAIL_AUTHORIZATION:{
        user: 'soumya.gowda@neutrinos.co',
        pass: 'P@sword4'  
      },
      NODE_ENV:"production"
}