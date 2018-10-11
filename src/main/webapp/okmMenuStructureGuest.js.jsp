var aItemData = [
		{
			text: "<em id=\"homelabel\"><spring:message code='menu.home' /></em>",
			url: "${pageContext.request.contextPath}/"
		},		
		{
			text: "<spring:message code='menu.basic' />",
			submenu: {
				id: "basic",
				itemdata: [
					{
						text: "<spring:message code='menu.basic.map' />",
						submenu: {
							id: "basicmapmenu",
							itemdata: [
								[
									<c:if test="${data.guest_map_allow != 0}">
									{ text: "<spring:message code='menu.mindmap.new'/>", helptext: "Ctrl + N", onclick: { fn: newMap } },
									</c:if>
									{ text: "<spring:message code='menu.mindmap.open'/>", helptext: "Ctrl + O", onclick: { fn: openMap } }
								]								
	
							]
						}
					}
				]
			}
		},
		<c:if test="${ user != null && user.username != 'guest'}">
		{
			text: "<spring:message code='menu.transformshare'/>",
			submenu: {
				id: "transformsharemenu",
				itemdata: [
					[	
						{
							text: "<spring:message code='menu.mindmap.import'/>",
							submenu: {
								id: "import",
								itemdata: [
									{ text: "<spring:message code='common.freemind'/>", onclick: { fn: importMap } },
									{ text: "<spring:message code='menu.plugin.bookmark'/>", onclick: { fn: importBookmark } }
								]
							}
						}
					]
				]
			}
		},
		</c:if>
		{
			text: "<spring:message code='menu.cs'/>",
			submenu: {
				id: "centermenu",
				itemdata: [
					[
						{ text: "<spring:message code='menu.cs.notice'/>", onclick: { fn: notice }, disabled: false },
						{ text: "<spring:message code='menu.cs.qna'/>", onclick: { fn: qna }, disabled: false }
					],
	
					[
						{ text: "<spring:message code='menu.cs.require'/>", onclick: { fn: requestFunction }, disabled: false }
					]
				]
			}
		},
		{
			text: "<spring:message code='menu.help'/>",
			submenu: {
				id: "helpmenu",
				itemdata: [[{
					text: "<spring:message code='menu.help.usage'/>",
					onclick: {
						fn: howtoUse
					},
					disabled: false
				}], [{
					text: "<spring:message code='menu.help.intromindmap'/>",
					onclick: {
						fn: aboutOKMindmap
					},
					disabled: false
				}, {
					text: "<spring:message code='menu.help.introjino'/>",
					onclick: {
						fn: aboutJinoTech
					},
					disabled: false
	
				}]]
			}
		}
	];