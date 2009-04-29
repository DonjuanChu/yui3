YUI.add("slider",function(A){var i="slider",Z="rail",m="thumb",l="value",U="min",o="max",J="minGutter",b="maxGutter",R="thumbImage",n="railSize",c="contentBox",Q="slideStart",a="slideEnd",X="thumbDrag",e="sync",H="positionThumb",j="rendered",d="disabled",O="disabledChange",W=".",q="px",D="width",f="height",S="complete",K=A.Lang,g=K.isBoolean,P=K.isString,p=K.isNumber,G=A.ClassNameManager.getClassName,N="image",B=G(i,Z),C=G(i,m),T=G(i,m,N),E=G(i,N,"error"),I=Math,V=I.max,k=I.round,F=I.floor;function h(){h.superclass.constructor.apply(this,arguments);}A.mix(h,{NAME:i,AXIS_KEYS:{x:{dim:D,offAxisDim:f,eventPageAxis:"pageX",ddStick:"stickX",xyIndex:0},y:{dim:f,offAxisDim:D,eventPageAxis:"pageY",ddStick:"stickY",xyIndex:1}},HTML_PARSER:{rail:W+B,thumb:W+C,thumbImage:W+T},ATTRS:{axis:{value:"x",writeOnce:true,validator:function(L){return this._validateNewAxis(L);},setter:function(L){return this._setAxisFn(L);}},min:{value:0,validator:function(L){return this._validateNewMin(L);}},max:{value:100,validator:function(L){return this._validateNewMax(L);}},value:{value:0,validator:function(L){return this._validateNewValue(L);},setter:function(L){return this._setValueFn(L);}},rail:{value:null,validator:function(L){return this._validateNewRail(L);},setter:function(L){return this._setRailFn(L);}},thumb:{value:null,validator:function(L){return this._validateNewThumb(L);},setter:function(L){return this._setThumbFn(L);}},thumbImage:{value:null,validator:function(L){return this._validateNewThumbImage(L);},setter:function(L){return this._setThumbImageFn(L);}},railSize:{value:"0",validator:function(L){return this._validateNewRailSize(L);}},railEnabled:{value:true,validator:g},minGutter:{value:0,validator:p},maxGutter:{value:0,validator:p}}});A.extend(h,A.Widget,{_key:null,_factor:1,_railSize:null,_thumbSize:null,_thumbOffset:0,_stall:false,_disabled:false,initializer:function(){this._key=h.AXIS_KEYS[this.get("axis")];this.after("minChange",this._afterMinChange);this.after("maxChange",this._afterMaxChange);this.after("railSizeChange",this._afterRailSizeChange);this.publish(Q);this.publish(a);this.publish(e,{defaultFn:this._defSyncFn});this.publish(H,{defaultFn:this._defPositionThumbFn});},renderUI:function(){this._initRail();this._initThumb();},_initRail:function(){var L=this.get(c),M=this.get(Z);if(!M){M=L.appendChild(A.Node.create('<div class="'+B+'"></div>'));this.set(Z,M);}else{if(!L.contains(M)){L.appendChild(M);}}M.addClass(B);M.addClass(this.getClassName(Z,this.get("axis")));},_initThumb:function(){var M=this.get(Z),L=this.get(m);if(L&&!this.get(R)&&L.get("nodeName").toLowerCase()==="img"){this.set(R,L);this.set(m,null);L=null;}if(!L){L=A.Node.create('<div class="'+C+'"></div>');this.set(m,L);}L.addClass(C);if(!M.contains(L)){M.appendChild(L);}if(this.get(R)){this._initThumbImage();}},_initThumbImage:function(){var M=this.get(m),L=this.get(R);if(L){L.replaceClass(C,T);if(!M.contains(L)){M.appendChild(L);}}},bindUI:function(){this.publish(X,{defaultFn:this._defUpdateValueFromDD});this._bindThumbDD();this.after("valueChange",this._afterValueChange);this.after("thumbImageChange",this._afterThumbImageChange);this.after(O,this._afterDisabledChange);},_bindThumbDD:function(){var M={node:this.get(m),constrain2node:this.get(Z)},L;M[this._key.ddStick]=true;this._dd=L=new A.DD.Drag(M);L.on("drag:start",A.bind(this._onDDStartDrag,this));L.on("drag:drag",A.bind(this._onDDDrag,this));L.on("drag:end",A.bind(this._onDDEndDrag,this));this._initRailDD();},_initRailDD:function(){this.get(Z).on("mousedown",A.bind(this._handleRailMouseDown,this));},_handleRailMouseDown:function(Y){if(this.get("railEnabled")&&!this.get(d)){var L=this._dd,r=this._key.xyIndex,M;if(L.get("primaryButtonOnly")&&Y.button>1){return false;}L._dragThreshMet=true;L._fixIEMouseDown();Y.halt();A.DD.DDM.activeDrag=L;M=L.get("dragNode").getXY();M[r]+=this._thumbOffset;L._setStartPosition(M);L.set("activeHandle",L.get("dragNode"));L.start();L._alignNode([Y.pageX,Y.pageY]);}},syncUI:function(){var L=this.get(R);if(this._isImageLoading(L)){this._scheduleSync();}else{this._ready(L,!this._isImageLoaded(L));}},_scheduleSync:function(){var L,M;if(!this._stall){this._disabled=this.get(d);this.set(d,true);this._stall=this.on(O,this._stallDisabledChange);L=this.get(R);M=A.bind(this._imageLoaded,this,L);L.on("load",M);L.on("error",M);}},_stallDisabledChange:function(L){this._disabled=L.newVal;L.preventDefault();},_imageLoaded:function(L,Y){var M=(Y.type.toLowerCase().indexOf("error")>-1);if(this._stall){this._stall.detach();}this._stall=false;this._ready(L,M);this.set(d,this._disabled);},_ready:function(L,M){var Y=M?"addClass":"removeClass";this.get(c)[Y](E);this.fire(e);},_defSyncFn:function(L){this._uiSetThumbSize();this._setThumbOffset();this._uiSetRailSize();this._setRailOffsetXY();this._setDDGutter();this._setFactor();var M=this.get(l);this.fire(H,{value:M,offset:this._convertValueToOffset(M)});},_uiSetThumbSize:function(){var M=this.get(m),r=this._key.dim,L=this.get(R),Y;Y=parseInt(M.getComputedStyle(r),10);if(L&&this._isImageLoaded(L)){Y=L.get(r);}this._thumbSize=Y;},_setThumbOffset:function(){this._thumbOffset=F(this._thumbSize/2);},_uiSetRailSize:function(){var t=this.get(Z),M=this.get(m),L=this.get(R),s=this._key.dim,Y=this.get(n),r=false;if(parseInt(Y,10)){t.setStyle(s,Y);Y=parseInt(t.getComputedStyle(s),10);}else{Y=this.get(s);if(parseInt(Y,10)){r=true;t.setStyle(s,Y);Y=parseInt(t.getComputedStyle(s),10);}Y=V(Y|0,parseInt(M.getComputedStyle(s),10),parseInt(t.getComputedStyle(s),10));if(L&&this._isImageLoaded(L)){Y=V(L.get(s),Y);}}t.setStyle(s,Y+q);this._railSize=Y;if(r){s=this._key.offAxisDim;Y=this.get(s);if(Y){t.set(s,Y);}}},_setRailOffsetXY:function(){this._offsetXY=this.get(Z).getXY()[this._key.xyIndex]+this.get(J);},_setDDGutter:function(){var L=this._key.xyIndex?this.get(J)+" 0 "+this.get(b):"0 "+this.get(b)+" 0 "+this.get(J);this._dd.set("gutter",L);},_setFactor:function(){var L=this._railSize-this._thumbSize-this.get(J)-this.get(b);this._factor=this._railSize?(this.get(o)-this.get(U))/L:1;
},getValue:function(){return this.get(l);},setValue:function(L){this.set(l,L);},_validateNewAxis:function(L){return P(L)&&"xXyY".indexOf(L.charAt(0))>-1;},_validateNewMin:function(L){return p(L);},_validateNewMax:function(L){return p(L);},_validateNewValue:function(M){var Y=this.get(U),L=this.get(o);return p(M)&&(Y<L?(M>=Y&&M<=L):(M>=L&&M<=Y));},_validateNewRail:function(L){return !this.get(j)||L;},_validateNewThumb:function(L){return !this.get(j)||L;},_validateNewThumbImage:function(L){return !this.get(j)||L;},_validateNewRailSize:function(L){return P(L)&&(L==="0"||/^\d+(?:p[xtc]|%|e[mx]|in|[mc]m)$/.test(L));},_setAxisFn:function(L){return L.charAt(0).toLowerCase();},_setValueFn:function(L){return L;},_setRailFn:function(L){return A.get(L)||null;},_setThumbFn:function(L){return A.get(L)||null;},_setThumbImageFn:function(L){return L?A.get(L)||A.Node.create('<img src="'+L+'" alt="Slider thumb">'):null;},_onDDStartDrag:function(L){this._setRailOffsetXY();this.fire(Q,{ddEvent:L});},_onDDDrag:function(L){this.fire(X,{ddEvent:L});},_defUpdateValueFromDD:function(M){var L=this.get(l),Y=M.ddEvent[this._key.eventPageAxis]-this._offsetXY;Y=k(this.get(U)+(Y*this._factor));if(L!==Y){this.set(l,Y,{ddEvent:M.ddEvent});}},_onDDEndDrag:function(L){this.fire(a,{ddEvent:L});},_defPositionThumbFn:function(L){this._uiPositionThumb(L.offset);},_uiPositionThumb:function(M){var L=this._dd;L._setStartPosition(L.get("dragNode").getXY());L._alignNode([M,M],true);},_afterValueChange:function(M){if(!M.ddEvent){var L=this._convertValueToOffset(M.newVal);this.fire(H,{value:M.newVal,offset:L});}},_convertValueToOffset:function(L){return k((L-this.get(U))/this._factor)+this._offsetXY;},_afterThumbChange:function(M){var L;if(this.get(j)){if(M.prevValue){M.prevValue.get("parentNode").removeChild(M.prevValue);}this._initThumb();L=this.get(m);this._dd.set("node",L);this._dd.set("dragNode",L);this.syncUI();}},_afterThumbImageChange:function(L){if(this.get(j)){if(L.prevValue){L.prevValue.get("parentNode").removeChild(L.prevValue);}this._initThumbImage();this.syncUI();}},_afterMinChange:function(L){this._refresh(L);},_afterMaxChange:function(L){this._refresh(L);},_afterRailSizeChange:function(L){this._refresh(L);},_afterDisabledChange:function(L){if(this._dd){this._dd.set("lock",L.newVal);}},_refresh:function(L){if(L.newVal!==L.prevVal&&this.get(j)){this.syncUI();}},_isImageLoading:function(L){return L&&!L.get(S);},_isImageLoaded:function(M){if(M){var L=M.get("naturalWidth");return M.get(S)&&(!p(L)?M.get(D):L);}return true;}});A.Slider=h;},"@VERSION@",{requires:["widget","dd-constrain"]});