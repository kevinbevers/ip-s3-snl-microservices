# Place pfx file here in production

/opt/app/smitenoobleague-microservices/certs

openssl pkcs12 -in INFILE.p12 -out OUTFILE.key -nodes -nocerts
openssl pkcs12 -export -in <CRTFILE> -inkey <KEYFILE> -out <PFXNAME>.pfx
scp ./smitechampions_xyz.pfx root@165.22.6.6:/opt/app/smitenoobleague-microservices/certs 