import * as samlify from 'samlify';
import * as fs from 'fs';
import * as validator from '@authenio/samlify-node-xmllint';

const binding = samlify.Constants.namespace.binding;

samlify.setSchemaValidator(validator);

// configure azure idp
const azureIdp = samlify.IdentityProvider({
  metadata: fs.readFileSync(__dirname + '/../metadata/Smala.xml'),
  wantLogoutRequestSigned: true
});

// configure our service provider (your application)
const sp = samlify.ServiceProvider({
  entityID: 'smala',
  authnRequestsSigned: false,
  wantAssertionsSigned: false,
  wantMessageSigned: true,
  wantLogoutResponseSigned: true,
  wantLogoutRequestSigned: true,
  privateKey: fs.readFileSync(__dirname + '/../key/sign/Smala.cer'),
  privateKeyPass: '',
  isAssertionEncrypted: false,
  assertionConsumerService: [{
    Binding: binding.post,
    Location: 'https://localhost:8080/sp/acs',
  }]
});

export const assignEntity = (req, res, next) => {

  req.idp = azureIdp;
  req.sp = sp;

  return next();

};