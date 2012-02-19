caterwaul.module( 'tangible.core' ,function(c) {$=c.merge(c, {require:require,process:process} ) ,$.tangible=function(image) {;
return( ( (tangible= (caterwaul.serialization() ) .decode(image) ) ) , (tangible.init() ) ) } } ) ;
