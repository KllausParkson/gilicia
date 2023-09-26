Configurando login social google android com CapacitorGoogleAuth

1. Install package

# for Capacitor 2.x.x

npm i --save @codetrix-studio/capacitor-google-auth@2.1.3

2. Update capacitor deps

Dentro do projeto ONEAPP_FRONTEND:

& 'C:\Program Files\Java\jdk1.8.0_301\bin\keytool.exe' -list -v -keystore .\chaves\oneapp.jks -alias one -storepass 123456 -keypass 123456

Nome do alias: one Data de criação: 21/10/2020 Tipo de entrada: PrivateKeyEntry Comprimento da cadeia de certificados: 1
Certificado[1]:
Proprietário: CN=Vinicius Teixeira, OU=Mobile, O=OneBeleza, L=Belo Horizonte, ST=Minas Gerais, C=BR Emissor: CN=Vinicius
Teixeira, OU=Mobile, O=OneBeleza, L=Belo Horizonte, ST=Minas Gerais, C=BR Número de série: 4ef5f01 Válido de: Wed Oct 21
13:58:09 BRT 2020 até: Sun Oct 15 13:58:09 BRT 2045 Fingerprints do certificado:
SHA1: 19:F4:B2:1A:E5:4B:96:A7:49:EC:0F:26:C1:DF:97:92:9C:A1:9E:94 SHA256: 93:93:55:0A:C1:11:2F:9A:30:84:A6:4B:FE:BE:55:
FC:B2:6C:62:D2:4B:84:DA:C2:40:FC:59:DF:58:9E:72:A6 Nome do algoritmo de assinatura: SHA256withRSA Algoritmo de Chave
Pública do Assunto: Chave RSA de 2048 bits Versão: 3

Extensões:

# 1: ObjectId: 2.5.29.14 Criticality=false

SubjectKeyIdentifier [
KeyIdentifier [
0000: 1A 52 F9 99 DE B8 28 E1   37 D5 66 53 A2 C4 F1 C5 .R....(.7.fS.... 0010: 69 DB E7 CD                                        i...
]
]

Warning:
O armazenamento de chaves JKS usa um formato proprietário. É recomendada a migração para PKCS12, que é um formato de
padrão industrial que usa "keytool -importkeystore -srckeystore .\chaves\oneapp.jks -destkeystore .\chaves\oneapp.jks
-deststoretype pkcs12".



<pre><code>This is a code block.
</code></pre>


npm i --save @codetrix-studio/capacitor-google-auth

Angular Fire
npm i @angularfire






Debug Key

& 'C:\Program Files\Java\jdk1.8.0_301\bin\keytool.exe' -list -v -alias androiddebugkey -keystore C:\Users\ValneyFaria\.android\debug.keystore
Senha: android


Obter o SHA-1 a partir da keystore da One:

#Keytool: 
Em Variáveis de Ambiente, sob Variáveis do sistema, na variável Path, adicionar: C:\Program Files\Java\jdk1.8.0_301\bin
Dessa forma, o keytool estará disponível a partir de qualquer tela.

keytool -list -v -keystore .\oneapp.jks -alias one -storepass 123456 -keypass 123456

Resultado: 

Nome do alias: one
Data de criação: 21/10/2020
Tipo de entrada: PrivateKeyEntry
Comprimento da cadeia de certificados: 1
Certificado[1]:
Proprietário: CN=Vinicius Teixeira, OU=Mobile, O=OneBeleza, L=Belo Horizonte, ST=Minas Gerais, C=BR
Emissor: CN=Vinicius Teixeira, OU=Mobile, O=OneBeleza, L=Belo Horizonte, ST=Minas Gerais, C=BR
Número de série: 4ef5f01
Válido de: Wed Oct 21 13:58:09 BRT 2020 até: Sun Oct 15 13:58:09 BRT 2045
Fingerprints do certificado:
         SHA1: 19:F4:B2:1A:E5:4B:96:A7:49:EC:0F:26:C1:DF:97:92:9C:A1:9E:94
         SHA256: 93:93:55:0A:C1:11:2F:9A:30:84:A6:4B:FE:BE:55:FC:B2:6C:62:D2:4B:84:DA:C2:40:FC:59:DF:58:9E:72:A6
Nome do algoritmo de assinatura: SHA256withRSA
Algoritmo de Chave Pública do Assunto: Chave RSA de 2048 bits
Versão: 3

Extensões:

#1: ObjectId: 2.5.29.14 Criticality=false
SubjectKeyIdentifier [
KeyIdentifier [
0000: 1A 52 F9 99 DE B8 28 E1   37 D5 66 53 A2 C4 F1 C5  .R....(.7.fS....
0010: 69 DB E7 CD                                        i...
]
]


Warning:
O armazenamento de chaves JKS usa um formato proprietário. É recomendada a migração para PKCS12, que é um formato de padrão industrial que usa "keytool -importkeystore -srckeystore .\oneapp.jks -destkeystore .\oneapp.jks -deststoretype pkcs12".