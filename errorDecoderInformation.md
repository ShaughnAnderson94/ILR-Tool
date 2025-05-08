# Intro
When data is stored in the XML or errors are output by the tool they use different names than the aritable. To help clarify bellow are two lists. One of all the rows in the aritable and their numbers. The other has all the data as it is entered into the system or output as errors as well as the row number from which it is fed. By looking at these two lists you should be able to interpret errors. You can figure out what row is being referred to by looking for the airtable row name with the same number (for example PHours has number 42 the same as Planned hours (aim 1) so you can tell that is what it means). It will also help if in the future there seems to be some sort of mix up to double check things are going to the right place. 

# Data as it goes into XML



2. ULN: index 2
3. FamilyName: index 4
4. GivenNames: index 3
5. DateOfBirth: index 6
6. Ethnicity: index 8
7. Sex: index 5
8. NINumber: index 7 (with whitespace removed)
9. PlanLearnHours: index 16 (optional)
10. PostcodePrior: index 9
11. Postcode: index 10
12. AddLine1: index 11
13. TelNo: index 12 (optional)
14. LLDDHealthProb: index 13 (converted to 1 or 9)
15. PriorAttain:
    - PriorLevel: index 15
    - DateLevelApp: index 14

16. LLDDandHealthProblem:
    - LLDDCat: index 13
    - PrimaryLLDD: hardcoded as 1

17. LearnerEmploymentStatus (First Employment Entry):
    - EmpStat: index 18
    - DateEmpStatApp: index 17
    - EmpId: index 19 (optional)
    - EmploymentStatusMonitoring:
      - LOE (ESMType): index 23
      - EII (ESMType): index 24
      - LOU (ESMType): index 25
      - SEI (ESMType): index 21
      - SEM (ESMType): index 20
      - OET (ESMType): index 22

18. LearnerEmploymentStatus (Second Employment Entry):
    - EmpStat: index 27
    - DateEmpStatApp: index 26
    - EmpId: index 28 (optional)
    - EmploymentStatusMonitoring:
      - EII (ESMType): index 29
      - LOE (ESMType): index 33
      - SEI (ESMType): index 31
      - SEM (ESMType): index 32
      - OET (ESMType): index 30

19. LearningDelivery:
    - LearnAimRef: index 35
    - AimType: index 34
    - LearnStartDate: index 36
    - LearnPlanEndDate: index 37
    - FundModel: index 38
    - PHours: index 42 (optional)
    - OTJActHours: index 43 (optional)
    - ProgType: index 39
    - StdCode: index 40 (optional)
    - DelLocPostCode: index 41
    - EPAOrgID: index 45 (optional)
    - ConRefNumber: index 44 (optional)
    - CompStatus: index 60 (optional)
    - LearnActEndDate: index 61 (optional)
    - WithdrawReason: index 64 (optional)
    - Outcome: index 63 (optional)
    - AchDate: index 62 (optional)
    - OutGrade: index 65 (optional)

20. LearningDeliveryFAM:
    - FFI (LearnDelFAMType): index 50
    - SOF (LearnDelFAMType): index 51
    - Contract Type: 
      - LearnDelFAMType: index 46
      - LearnDelFAMCode: index 47
      - LearnDelFAMDateFrom: index 48 (optional)
      - LearnDelFAMDateTo: index 49 (optional)

21. AppFinRecord:
    - First Financial Record:
      - AFinType: index 52
      - AFinCode: index 53 (optional)
      - AFinDate: index 54 (optional)
      - AFinAmount: index 55 (optional)
    - Second Financial Record:
      - AFinType: index 56
      - AFinCode: index 57 (optional)
      - AFinDate: index 58 (optional)
      - AFinAmount: index 59 (optional)

# Data as it is displayed in the airTable

0. Record
1. Previous UKPRN
2. ULN
3. Given name
4. Family name
5. Sex
6. Date of birth
7. NI number
8. Ethnic group
9. Prior post code
10. Post code
11. Street address
12. Telephone number
13. Primary additional needs
14. Prior attainment date applies to
15. Prior attainment
16. Learning hours (skills bootcamp)
17. Employment #1 date applies to
18. Employment status #1
19. Employer identifier #1
20. Small employer #1
21. Is the learner self employed? #1
22. Has the learner been made redundant? #1
23. Length of employment #1
24. Employment intensity indicator #1
25. Length of unemployment #1
26. Employment #2 date applies to
27. Employment status #2
28. Employer identifier #2
29. Employment intensity indicator #2
30. Has the learner been made redundant? #2
31. Is the learner self employed? #2
32. Small employer #2
33. Length of employment #2
34. Aim type (programme aim 1)
35. Programme aim 1 Learning ref
36. Start date (aim 1)
37. Planned end date (aim 1)
38. Funding module (aim 1)
39. Programme type (aim 1)
40. Apprentice standard (aim 1)
41. Delivery postcode (aim 1)
42. Planned hours (aim 1)
43. Actual hours (aim 1)
44. Contract Ref (aim 1)
45. EPAO ID (aim 1)
46. Contract type (aim 1)
47. Contract type code (aim 1)
48. Date applies from (aim1)
49. Date applies to (aim 1)
50. Funding indicator (aim 1)
51. Source of funding (aim 1)
52. Financial type 1 (aim 1)
53. Financial code 1 (aim 1)
54. Financial start date 1 (aim 1)
55. Training price (aim 1)
56. Financial type 2 (aim 1)
57. Financial code 2 (aim 1)
58. Financial start date 2 (aim 1)
59. Total assessment price (aim 1)
60. Completion status (aim 1)
61. Actual end date (aim 1)
62. Achievement date (aim 1)
63. Outcome (aim 1)
64. Withdrawal reason (aim 1)
65. Outcome grade (aim 1)
66. Aim type (programme aim 2)
67. Programme aim 2 Learning ref
68. Start date (aim 2)
69. Planned end date (aim 2)
70. Funding module (aim 2)
71. Programme type (aim 2)
72. Apprentice standard (aim 2)
73. Delivery postcode (aim 2)
74. Planned hours (aim2)
75. Actual hours (aim 2)
76. Contract ref (aim 2)
77. EPAO ID (aim 2)
78. Contract type (aim 2)
79. Contract type code (aim 2)
80. Date applies from (aim 2)
81. Date applies to (aim 2)
82. Funding indicator (aim 2)
83. Source of funding (aim 2)
84. Financial type 1 (aim 2)
85. Financial code 1 (aim 2)
86. Financial start date 1 (aim 2)
87. Training price (aim 2)
88. Financial type 2 (aim 2)
89. Financial code 2 (aim 2)
90. Financial start date 2 (aim 2)
91. Total assessment price (aim 2)
92. Completion status (aim 2)
93. Actual end date (aim 2)
94. Achievement date (aim 2)
95. Outcome (aim 2)
96. Withdrawal reason (aim 2)
97. Outcome grade (aim 2)
98. Aim type (programme aim 3)
99. Programme aim 3 learning ref
100. Start date (aim 3)
101. Planned end date (aim 3)
102. Funding module (aim 3)
103. Programme type (aim 3)
104. Apprentice standard (aim 3)
105. Delivery postcode (aim 3)
106. Planned hours (aim 3)
107. Actual hours (aim 3)
108. Contract ref (aim 3)
109. EPAO ID (aim 3)
110. Contract type (aim 3)
111. Contract type code (aim 3)
112. Date applies from (aim 3)
113. Date applies to (aim 3)
114. Funding indicator (aim 3)
115. Source of funding (aim 3)
116. Financial type 1 (aim 3)
117. Financial code 1 (aim 3)
118. Financial start date 1 (aim 3)
119. Training price (aim 3)
120. Financial type 2 (aim 3)
121. Financial code 2 (aim 3)
122. Financial start date 2 (aim 3)
123. Total assessment price (aim 3)
124. Completion status (aim 3)
125. Actual end date (aim 3)
126. Achievement date (aim 3)
127. Withdrawal reason (aim 3)
128. Outcome (aim 3)
129. Outcome grade (aim 3)
130. Aim type (programme aim 4)
131. Programme aim 2 learning ref
132. Start date (aim 4)
133. Planned end date (aim 4)
134. Funding module (aim 4)
135. Programme type (aim 4)
136. Apprentice standard (aim 4)
137. Delivery postcode (aim 4)
138. Planned hours (aim 4)
139. Actual hours (aim 4)
140. Contract ref (aim 4)
141. EPAO ID (aim 4)
142. Contract type (aim 4)
143. Contract type code (aim 4)
144. Date applies from (aim 4)
145. Date applies to (aim 4)
146. Funding indicator (aim 4)
147. Source of funding (aim 4)
148. Financial type 1 (aim 4)
149. Financial code 1 (aim 4)
150. Financial start date 1 (aim 4)
151. Training price (aim 4)
152. Financial type 2 (aim 4)
153. Financial code 2 (aim 4)
154. Financial start date 2 (aim 4)
155. Total assessment price (aim 4)
156. Completion status (aim 4)
157. Actual end date (aim 4)
158. Achievement date (aim 4)
159. Withdrawal reason (aim 4)
160. Outcome (aim 4)
161. Outcome grade (aim 4)
162. Aim type (programme aim 5)
163. Programme aim 5 learning ref
164. Start date (aim 5)
165. Planned end date (aim 5)
166. Funding module (aim 5)
167. Programme type (aim 5)
168. Apprentice standard (aim 5)
169. Delivery postcode (aim 5)
170. Planned hours (aim 5)
171. Actual hours (aim 5)
172. Contract ref (aim 5)
173. EPAO ID (aim 5)
174. Contract type (aim 5)
175. Contract type code (aim 5)
176. Date applies from (aim 5)
177. Date applies to (aim 5)
178. Funding indicator (aim 5)
179. Source of funding (aim 5)
180. Financial type 1 (aim 5)
181. Financial code 1 (aim 5)
182. Financial start date 1 (aim 5)
183. Training price (aim 5)
184. Financial type 2 (aim 5)
185. Financial code 2 (aim 5)
186. Financial start date 2 (aim 5)
187. Total assessment price (aim 5)
188. Completion status (aim 5)
189. Actual end date (aim 5)
190. Achievement date (aim 5)
191. Withdrawal reason (aim 5)
192. Outcome (aim 5)
193. Outcome grade (aim 5)

