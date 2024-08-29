var Mailcheck={domainThreshold:2,secondLevelThreshold:2,topLevelThreshold:2,defaultDomains:['gmail.com'],defaultSecondLevelDomains:["gmail"],defaultTopLevelDomains:["com"],run:function(opts){opts.domains=opts.domains||Mailcheck.defaultDomains;opts.secondLevelDomains=opts.secondLevelDomains||Mailcheck.defaultSecondLevelDomains;opts.topLevelDomains=opts.topLevelDomains||Mailcheck.defaultTopLevelDomains;opts.distanceFunction=opts.distanceFunction||Mailcheck.sift4Distance;var defaultCallback=function(result){return result};var suggestedCallback=opts.suggested||defaultCallback;var emptyCallback=opts.empty||defaultCallback;var result=Mailcheck.suggest(Mailcheck.encodeEmail(opts.email),opts.domains,opts.secondLevelDomains,opts.topLevelDomains,opts.distanceFunction);return result?suggestedCallback(result):emptyCallback()},suggest:function(email,domains,secondLevelDomains,topLevelDomains,distanceFunction){email=email.toLowerCase();var emailParts=this.splitEmail(email);if(secondLevelDomains&&topLevelDomains){if(secondLevelDomains.indexOf(emailParts.secondLevelDomain)!==-1&&topLevelDomains.indexOf(emailParts.topLevelDomain)!==-1){return!1}}
var closestDomain=this.findClosestDomain(emailParts.domain,domains,distanceFunction,this.domainThreshold);if(closestDomain){if(closestDomain==emailParts.domain){return!1}else{return{address:emailParts.address,domain:closestDomain,full:emailParts.address+"@"+closestDomain}}}
var closestSecondLevelDomain=this.findClosestDomain(emailParts.secondLevelDomain,secondLevelDomains,distanceFunction,this.secondLevelThreshold);var closestTopLevelDomain=this.findClosestDomain(emailParts.topLevelDomain,topLevelDomains,distanceFunction,this.topLevelThreshold);if(emailParts.domain){closestDomain=emailParts.domain;var rtrn=!1;if(closestSecondLevelDomain&&closestSecondLevelDomain!=emailParts.secondLevelDomain){closestDomain=closestDomain.replace(emailParts.secondLevelDomain,closestSecondLevelDomain);rtrn=!0}
if(closestTopLevelDomain&&closestTopLevelDomain!=emailParts.topLevelDomain&&emailParts.secondLevelDomain!==''){closestDomain=closestDomain.replace(new RegExp(emailParts.topLevelDomain+"$"),closestTopLevelDomain);rtrn=!0}
if(rtrn){return{address:emailParts.address,domain:closestDomain,full:emailParts.address+"@"+closestDomain}}}
return!1},findClosestDomain:function(domain,domains,distanceFunction,threshold){threshold=threshold||this.topLevelThreshold;var dist;var minDist=Infinity;var closestDomain=null;if(!domain||!domains){return!1}
if(!distanceFunction){distanceFunction=this.sift4Distance}
for(var i=0;i<domains.length;i++){if(domain===domains[i]){return domain}
dist=distanceFunction(domain,domains[i]);if(dist<minDist){minDist=dist;closestDomain=domains[i]}}
if(minDist<=threshold&&closestDomain!==null){return closestDomain}else{return!1}},sift4Distance:function(s1,s2,maxOffset){if(maxOffset===undefined){maxOffset=5}
if(!s1||!s1.length){if(!s2){return 0}
return s2.length}
if(!s2||!s2.length){return s1.length}
var l1=s1.length;var l2=s2.length;var c1=0;var c2=0;var lcss=0;var local_cs=0;var trans=0;var offset_arr=[];while((c1<l1)&&(c2<l2)){if(s1.charAt(c1)==s2.charAt(c2)){local_cs++;var isTrans=!1;var i=0;while(i<offset_arr.length){var ofs=offset_arr[i];if(c1<=ofs.c1||c2<=ofs.c2){isTrans=Math.abs(c2-c1)>=Math.abs(ofs.c2-ofs.c1);if(isTrans){trans++}else{if(!ofs.trans){ofs.trans=!0;trans++}}
break}else{if(c1>ofs.c2&&c2>ofs.c1){offset_arr.splice(i,1)}else{i++}}}
offset_arr.push({c1:c1,c2:c2,trans:isTrans})}else{lcss+=local_cs;local_cs=0;if(c1!=c2){c1=c2=Math.min(c1,c2)}
for(var j=0;j<maxOffset&&(c1+j<l1||c2+j<l2);j++){if((c1+j<l1)&&(s1.charAt(c1+j)==s2.charAt(c2))){c1+=j-1;c2--;break}
if((c2+j<l2)&&(s1.charAt(c1)==s2.charAt(c2+j))){c1--;c2+=j-1;break}}}
c1++;c2++;if((c1>=l1)||(c2>=l2)){lcss+=local_cs;local_cs=0;c1=c2=Math.min(c1,c2)}}
lcss+=local_cs;return Math.round(Math.max(l1,l2)-lcss+trans)},splitEmail:function(email){email=email!==null?(email.replace(/^\s*/,'').replace(/\s*$/,'')):null;var parts=email.split('@');if(parts.length<2){return!1}
for(var i=0;i<parts.length;i++){if(parts[i]===''){return!1}}
var domain=parts.pop();var domainParts=domain.split('.');var sld='';var tld='';if(domainParts.length===0){return!1}else if(domainParts.length==1){tld=domainParts[0]}else{sld=domainParts[0];for(var j=1;j<domainParts.length;j++){tld+=domainParts[j]+'.'}
tld=tld.substring(0,tld.length-1)}
return{topLevelDomain:tld,secondLevelDomain:sld,domain:domain,address:parts.join('@')}},encodeEmail:function(email){var result=encodeURI(email);result=result.replace('%20',' ').replace('%25','%').replace('%5E','^').replace('%60','`').replace('%7B','{').replace('%7C','|').replace('%7D','}');return result}};if(typeof module!=='undefined'&&module.exports){module.exports=Mailcheck}
if(typeof define==="function"&&define.amd){define("mailcheck",[],function(){return Mailcheck})}
if(typeof window!=='undefined'&&window.jQuery){(function($){$.fn.mailcheck=function(opts){var self=this;if(opts.suggested){var oldSuggested=opts.suggested;opts.suggested=function(result){oldSuggested(self,result)}}
if(opts.empty){var oldEmpty=opts.empty;opts.empty=function(){oldEmpty.call(null,self)}}
opts.email=this.val();Mailcheck.run(opts)}})(jQuery)}
;