var FabrikComment=new Class({Implements:[Options,Events],getOptions:function(){return{formid:0,rowid:0,label:""}},initialize:function(c,b){this.element=$(c);if(typeOf(this.element)==="null"){return}this.setOptions(this.getOptions(),b);this.fx={};this.fx.toggleForms=$H();this.spinner=new Element("img",{styles:{display:"none"},src:Fabrik.liveSite+"media/com_fabrik/images/ajax-loader.gif"});this.doAjaxDeleteComplete=this.deleteComplete.bindWithEvent(this);this.ajax={};var a=Fabrik.liveSite+"index.php";this.ajax.deleteComment=new Request({url:a,method:"get",data:{option:"com_fabrik",format:"raw",view:"plugin",task:"pluginAjax",plugin:"comment",method:"deleteComment",g:"form",formid:this.options.formid,rowid:this.options.rowid},onComplete:this.doAjaxDeleteComplete});this.ajax.updateComment=new Request({url:a+"?option=com_fabrik&format=raw&view=plugin&task=pluginAjax&plugin=comment&method=updateComment&g=form",method:"post",data:{formid:this.options.formid,rowid:this.options.rowid}});this.watchReply();this.watchInput()},ajaxComplete:function(e){e=JSON.decode(e);var c=(e.depth.toInt()*20)+"px";var f="comment_"+e.id;var a=new Element("li",{id:f,styles:{"margin-left":c}}).set("html",e.content);if(this.currentLi.get("tag")==="li"){a.inject(this.currentLi,"after")}else{a.inject(this.currentLi)}var b=new Fx.Tween(a,{property:"opacity",duration:5000});b.set(0);b.start(0,100);this.watchReply();if(typeOf(e.message)!=="null"){alert(e.message.title,e.message.message)}if(this.spinner){this.spinner.setStyle("display","none")}this.watchInput();this.updateDigg()},watchInput:function(){var a=Fabrik.liveSite+"index.php";this.ajax.addComment=new Request({url:a,method:"get",data:{option:"com_fabrik",format:"raw",view:"plugin",task:"pluginAjax",plugin:"comment",method:"addComment",g:"form",formid:this.options.formid,rowid:this.options.rowid,label:this.options.label},onComplete:function(b){this.ajaxComplete(b)}.bind(this)});this.element.getElements(".replyform").each(function(c){var b=c.getElement("textarea");if(!b){return}c.getElement("input[type=button]").addEvent("click",this.doInput.bindWithEvent(this));b.addEvent("click",this.testInput.bindWithEvent(this));(this.spinner).inject(this.element.getElement("input[type=button]"),"after")}.bind(this))},testInput:function(a){if(a.target.get("value")===Joomla.JText._("PLG_FORM_COMMENT_TYPE_A_COMMENT_HERE")){a.target.value=""}},updateDigg:function(){if(typeOf(this.digg)!=="null"){this.digg.removeEvents();this.digg.addEvents()}},doInput:function(i){var b=new Event(i);this.spinner.inject($(b.target),"after");var j=$(b.target).getParent(".replyform");if(j.id==="master-comment-form"){var m=this.element.getElement("ul").getElements("li");if(m.length>0){this.currentLi=m.pop()}else{this.currentLi=this.element.getElement("ul")}}else{this.currentLi=j.findUp("li")}if(i.type==="keydown"){if(i.keyCode.toInt()!==13){this.spinner.setStyle("display","none");return}}this.spinner.setStyle("display","");var l=j.getElement("textarea").get("value");if(l===""){this.spinner.setStyle("display","none");alert(Joomla.JText._("PLG_FORM_COMMENT_PLEASE_ENTER_A_COMMENT_BEFORE_POSTING"));return}b.stop();var c=j.getElement("input[name=name]");if(c){var g=c.get("value");if(g===""){this.spinner.setStyle("display","none");alert(Joomla.JText._("PLG_FORM_COMMENT_PLEASE_ENTER_A_NAME_BEFORE_POSTING"));return}this.ajax.addComment.options.data.name=g}var h=j.getElements("input[name^=comment-plugin-notify]").filter(function(e){return e.checked});var k=j.getElement("input[name=email]");if(k){var f=k.get("value");if(f===""){this.spinner.setStyle("display","none");alert(Joomla.JText._("PLG_FORM_COMMENT_ENTER_EMAIL_BEFORE_POSTNG"));return}}var a=j.getElement("input[name=reply_to]").get("value");if(a===""){a=0}if(j.getElement("input[name=email]")){this.ajax.addComment.options.data.email=j.getElement("input[name=email]").get("value")}this.ajax.addComment.options.data.renderOrder=j.getElement("input[name=renderOrder]").get("value");if(j.getElement("select[name=rating]")){this.ajax.addComment.options.data.rating=j.getElement("select[name=rating]").get("value")}if(j.getElement("input[name^=annonymous]")){var d=j.getElements("input[name^=annonymous]").filter(function(e){return e.checked===true});this.ajax.addComment.options.data.annonymous=d[0].get("value")}this.ajax.addComment.options.data.reply_to=a;this.ajax.addComment.options.data.comment=l;this.ajax.addComment.send();this.element.getElement("textarea").value=""},saveComment:function(b){var a=b.getParent(".comment").id.replace("comment-","");this.ajax.updateComment.options.data.comment_id=a;this.ajax.updateComment.options.data.comment=b.get("text");this.ajax.updateComment.send()},watchReply:function(){this.element.getElements(".replybutton").each(function(c){var e;c.removeEvents();var d=c.getParent().getParent().getNext();if(typeOf(d)==="null"){d=c.getParent(".comment").getElement(".replyform")}if(typeOf(d)!=="null"){var b=c.getParent(".comment").findUp("li");if(window.ie){e=new Fx.Slide(d,"opacity",{duration:5000})}else{if(this.fx.toggleForms.has(b.id)){e=this.fx.toggleForms.get(b.id)}else{e=new Fx.Slide(d,"opacity",{duration:5000});this.fx.toggleForms.set(b.id,e)}}e.hide();c.addEvent("click",function(a){a=new Event(a).stop();e.toggle()}.bind(this))}}.bind(this));this.element.getElements(".del-comment").each(function(b){b.removeEvents();b.addEvent("click",function(c){var a=new Event(c);this.ajax.deleteComment.options.data.comment_id=$(a.target).getParent(".comment").id.replace("comment-","");this.ajax.deleteComment.send();this.updateDigg();a.stop()}.bind(this))}.bind(this));if(this.options.admin){this.element.getElements(".comment-content").each(function(b){b.removeEvents();b.addEvent("click",function(f){b.inlineEdit({defaultval:"",type:"textarea",onComplete:function(c,h,e){this.saveComment(c)}.bind(this)});var g=f.target.getParent();var a=g.id.replace("comment-","");var d=Fabrik.liveSite+"index.php";new Request({url:d,method:"get",data:{option:"com_fabrik",format:"raw",view:"plugin",task:"pluginAjax",plugin:"comment",method:"getEmail",commentid:a,g:"form",formid:this.options.formid,rowid:this.options.rowid},onComplete:function(c){g.getElements(".info").dispose();new Element("span",{"class":"info"}).set("html",c).injectInside(g)}.bind(this)}).send();f.stop()}.bind(this))}.bind(this))}},deleteComplete:function(b){var d=$("comment_"+b);var a=new Fx.Morph(d,{duration:1000,transition:Fx.Transitions.Quart.easeOut});a.start({opacity:0,height:0}).chain(function(){d.dispose()})}});