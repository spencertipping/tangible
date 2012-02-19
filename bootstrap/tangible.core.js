caterwaul.module( 'tangible.core' ,function(c) {$=c,$.require=require,$.tangible=function(image) {;
return( ( (tangible= (caterwaul.serialization() ) .decode(image) ) ) , (tangible.init() ) ) } } ) ;
