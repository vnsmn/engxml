<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">
	<xsl:import href="murphy_smalzer_basic.xsl"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
				<title>english</title>
				<style type="text/css">
					h1 { padding: 10px; padding-width: 100%; background-color: silver }
					td, th { width: 40%; border: 1px solid silver; padding: 10px }
					td:first-child, th:first-child { width: 20% }
					table { width: 650px }
				</style>
			</head>
			<body>
				<xsl:apply-imports/>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet> 
