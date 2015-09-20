# angularjs

#apache2
1) konfiguracja proxy:
2) dodano 2 moduly: mod_proxy, mod_proxy_http
3) zmiany w 'mods-enabled/proxy.conf' (ProxyRequests moze byc on lub off):
  ProxyRequests On
  ProxyVia On
        <Proxy *>
           Order allow,deny
        Allow from all
                #AddDefaultCharset off
           #Require all denied
           ##Require local
        </Proxy>

ProxyPass /api http://localhost:8080/api
ProxyPassreverse / http://localhost:8080/


