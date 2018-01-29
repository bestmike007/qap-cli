/*XSD文件，约束Manifest.xml格式*/
var schemaString = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
    "<xs:schema xmlns:xs=\"http://www.w3.org/2001/XMLSchema\">  \n" +
    "  <xs:element name=\"rn-version\" type=\"xs:string\"> \n" +
    "  </xs:element>  \n" +
    "  <xs:simpleType name=\"DefaultPageType\"> \n" +
    "    <xs:restriction base=\"xs:string\"> \n" +
    "      <xs:enumeration value=\"true\"/> \n" +
    "    </xs:restriction> \n" +
    "  </xs:simpleType>  \n" +
    "  <xs:element name=\"page\"> \n" +
    "    <xs:complexType> \n" +
    "      <xs:simpleContent> \n" +
    "        <xs:extension base=\"xs:string\"> \n" +
    "          <xs:attribute name=\"default\" type=\"DefaultPageType\"/>  \n" +
    "          <xs:attribute name=\"capability\" type=\"xs:string\"/>  \n" +
    "          <xs:attribute name=\"launchMode\"> \n" +
    "            <xs:simpleType> \n" +
    "              <xs:restriction base=\"xs:string\"> \n" +
    "                <xs:enumeration value=\"standard\"/>  \n" +
    "                <xs:enumeration value=\"singleTask\"/> \n" +
    "              </xs:restriction> \n" +
    "            </xs:simpleType> \n" +
    "          </xs:attribute> \n" +
    "        </xs:extension> \n" +
    "      </xs:simpleContent> \n" +
    "    </xs:complexType> \n" +
    "  </xs:element>  \n" +
    "  <xs:element name=\"pages\"> \n" +
    "    <xs:complexType> \n" +
    "      <xs:sequence> \n" +
    "        <xs:element ref=\"page\" minOccurs=\"1\" maxOccurs=\"unbounded\"/> \n" +
    "      </xs:sequence>\n" +
    "    </xs:complexType> \n" +
    "    <xs:unique name=\"UniqueDefaultPage\"> \n" +
    "      <xs:selector xpath=\"page\"/>  \n" +
    "      <xs:field xpath=\"@default\"/> \n" +
    "    </xs:unique> \n" +
    "  </xs:element>  \n" +
    "  <xs:element name=\"manifest\"> \n" +
    "    <xs:complexType> \n" +
    "      <xs:sequence> \n" +
    "        <xs:element ref=\"rn-version\" minOccurs=\"0\" maxOccurs=\"1\"/>  \n" +
    "        <xs:element ref=\"pages\" minOccurs=\"1\" maxOccurs=\"1\"/> \n" +
    "      </xs:sequence>\n" +
    "      <xs:attribute name=\"appKey\" type=\"xs:string\" use=\"required\"/>  \n" +
    "      <xs:attribute name=\"version\" type=\"xs:string\" use=\"required\"/>\n" +
    "    </xs:complexType> \n" +
    "  </xs:element> \n" +
    "</xs:schema>\n";

    exports.schema = schemaString;